import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Connection, Types } from 'mongoose';
import { AppModule } from '../../../app.module';
import { DatabaseService } from '../../../database/database.service';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

const createTestUser = async (username: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = new Types.ObjectId();
  return {
    _id: userId,
    username,
    hashedPassword,
    score: Math.floor(Math.random() * 100),
    played: Math.floor(Math.random() * 10),
    wins: Math.floor(Math.random() * 5),
  };
};

describe('UsersController (Integration)', () => {
  let dbConnection: Connection;
  let app: INestApplication;
  let httpServer: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('rooms').deleteMany({});
    await dbConnection.collection('teams').deleteMany({});
    await dbConnection.collection('archivedUsers').deleteMany({});
  });

  describe('findAll: GET /users', () => {
    it('should return all users sorted by score in descending order matching UserSafeDto', async () => {
      const users = [
        await createTestUser('testuser1', 'StrongPass1!'),
        await createTestUser('testuser2', 'StrongPass2!'),
        await createTestUser('testuser3', 'StrongPass3!'),
      ];

      await dbConnection.collection('users').insertMany(users);

      const response = await request(httpServer).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);

      expect(response.body[0].score).toBeGreaterThanOrEqual(
        response.body[1].score,
      );
      expect(response.body[1].score).toBeGreaterThanOrEqual(
        response.body[2].score,
      );

      response.body.forEach((user) => {
        const originalUser = users.find((u) => u.username === user.username);
        expect(user).toHaveProperty('userId');
        expect(user).toHaveProperty('username', originalUser?.username);
        expect(user).toHaveProperty('score', originalUser?.score);
        expect(user).toHaveProperty('played', originalUser?.played);
        expect(user).toHaveProperty('wins', originalUser?.wins);
      });
    });

    it('should return an empty array if there are no users', async () => {
      const response = await request(httpServer).get('/users');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('findOne: GET /users/:userId', () => {
    it('should return a specified user by id matching UserSafeDto', async () => {
      const user = await createTestUser('testuser1', 'StrongPass1!');
      const { insertedId } = await dbConnection
        .collection('users')
        .insertOne(user);

      const response = await request(httpServer).get(`/users/${insertedId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('userId', insertedId.toString());
      expect(response.body).toHaveProperty('username', user.username);
      expect(response.body).toHaveProperty('score', user.score);
      expect(response.body).toHaveProperty('played', user.played);
      expect(response.body).toHaveProperty('wins', user.wins);
      expect(response.body).not.toHaveProperty('hashedPassword');
    });

    it('should return 404 if user not found', async () => {
      const user = await createTestUser('testuser1', 'StrongPass1!');
      await dbConnection.collection('users').insertOne(user);
      const fakeId = new Types.ObjectId();

      const response = await request(httpServer).get(`/users/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toEqual('User not found.');
    });
  });

  describe('update: PATCH /users/:userId', () => {
    const updateData: UpdateUserDto = { username: 'updatedUser' };

    it('should update a specified user by id', async () => {
      const user = await createTestUser('tesUpdateUser1', 'StrongPass1!');
      const { insertedId } = await dbConnection
        .collection('users')
        .insertOne(user);

      const response = await request(httpServer)
        .patch(`/users/${insertedId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('userId', insertedId.toString());
      expect(response.body).toHaveProperty('username', updateData.username);
      expect(response.body).toHaveProperty('score', user.score);
      expect(response.body).toHaveProperty('played', user.played);
      expect(response.body).toHaveProperty('wins', user.wins);
      expect(response.body).not.toHaveProperty('hashedPassword');
    });

    it('should return 404 if user not found', async () => {
      const user = await createTestUser('updatedUser', 'StrongPass1!');
      await dbConnection.collection('users').insertOne(user);
      const fakeId = new Types.ObjectId();

      const response = await request(httpServer)
        .patch(`/users/${fakeId}`)
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.message).toEqual('User not found.');
    });
  });

  describe('remove: DELETE /users/:userId', () => {
    it('should soft delete a user', async () => {
      const user = await createTestUser('deleteuser1', 'StrongPass1!');
      const { insertedId } = await dbConnection
        .collection('users')
        .insertOne(user);

      const response = await request(httpServer)
        .delete(`/users/${insertedId}`)
        .query({ hardDelete: 'false' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        'User account soft deleted and moved to archive successfully.',
      );

      const archivedUser = await dbConnection
        .collection('archivedUsers')
        .findOne({ _id: insertedId });
      expect(archivedUser).not.toBeNull();
      expect(archivedUser.username).toBe('deleteuser1');

      const deletedUser = await dbConnection
        .collection('users')
        .findOne({ _id: insertedId });
      expect(deletedUser).toBeNull();
    });

    it('should hard delete a user', async () => {
      const user = await createTestUser('deleteuser1', 'StrongPass1!');
      const { insertedId } = await dbConnection
        .collection('users')
        .insertOne(user);

      const response = await request(httpServer)
        .delete(`/users/${insertedId}`)
        .query({ hardDelete: 'true' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User account permanently deleted.');

      const deletedUser = await dbConnection
        .collection('users')
        .findOne({ _id: insertedId });
      expect(deletedUser).toBeNull();
    });

    it('should return 404 if the user is not found for deletion', async () => {
      const fakeUserId = new Types.ObjectId();
      const response = await request(httpServer).delete(`/users/${fakeUserId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found.');
    });
  });
});
