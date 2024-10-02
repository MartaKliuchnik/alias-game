import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';
import { UsersService } from '../users.service';
import { Model, Types } from 'mongoose';
import { ArchivedUser } from '../schemas/archived-user.schema';
import { createUserStub } from './stubs/create-user.stub';
import { userStub } from './stubs/user.stub';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserSafeDto } from '../dto/user-safe.dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let userModel: Model<User>;
  let archivedUserModel: Model<ArchivedUser>;

  const createdUser = createUserStub();
  const dbUser = {
    _id: new Types.ObjectId('66f8f7fb027b5bb2be6d0dd9'),
    username: createdUser.username,
    hashedPassword:
      '$2b$10$sTwo3ikfhwswHJ6nRXAU1Ocm42E1VWJIA2o.aUnaFuIyJ1xRgmEO.',
    score: 0,
    played: 0,
    wins: 0,
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn().mockReturnValue({
              exec: jest.fn(),
            }),
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
        {
          provide: getModelToken(ArchivedUser.name),
          useValue: {
            create: jest.fn().mockImplementation((archivedUser) => {
              return {
                ...archivedUser,
                save: jest.fn().mockResolvedValue(archivedUser),
              };
            }),
          },
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    userModel = moduleRef.get<Model<User>>(getModelToken(User.name));
    archivedUserModel = moduleRef.get<Model<ArchivedUser>>(
      getModelToken(ArchivedUser.name),
    );

    jest
      .spyOn(usersService as any, 'hashPassword')
      .mockResolvedValue(
        '$2b$10$sTwo3ikfhwswHJ6nRXAU1Ocm42E1VWJIA2o.aUnaFuIyJ1xRgmEO.',
      );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user if it does not exist', async () => {
      userModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      userModel.create = jest.fn().mockResolvedValue(dbUser);

      const result = await usersService.createUser(createdUser);

      expect(userModel.findOne).toHaveBeenCalledWith({
        username: createdUser.username,
      });
      expect(usersService['hashPassword']).toHaveBeenCalledWith(
        createdUser.password,
      );

      expect(userModel.create).toHaveBeenCalledWith({
        username: createdUser.username,
        hashedPassword: dbUser.hashedPassword,
      });
      expect(result).toEqual({
        userId: '66f8f7fb027b5bb2be6d0dd9',
        user: dbUser,
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      userModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(userStub()),
      });

      await expect(
        usersService.createUser({
          username: createdUser.username,
          password: createdUser.password,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('getUsers', () => {
    it('should return a list of users from the database', async () => {
      userModel.find = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([dbUser]),
      });

      const result = await usersService.getUsers();

      expect(userModel.find).toHaveBeenCalled();
      expect(result).toEqual([userStub()]);
    });

    it('should return an empty array if users are not found', async () => {
      userModel.find = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await usersService.getUsers();

      expect(userModel.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should throw InternalServerErrorException if a general error occurs', async () => {
      userModel.find = jest.fn().mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(usersService.getUsers()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getUserById', () => {
    const userId = new Types.ObjectId('66f8f7fb027b5bb2be6d0dd9');

    it('should return a user', async () => {
      userModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(dbUser),
      });

      const result = await usersService.getUserById(userId);

      expect(userModel.findById).toHaveBeenCalled();
      expect(result).toEqual(userStub());
    });

    it('should throw NotFoundException if user is not found', async () => {
      userModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(usersService.getUserById(userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException if a general error occurs', async () => {
      userModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(usersService.getUserById(userId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('updateUser', () => {
    const userId = new Types.ObjectId('66f8f7fb027b5bb2be6d0dd9');
    let updateUserDto: UpdateUserDto;

    const expectedUser: UserSafeDto = {
      userId: userId.toString(),
      username: 'newUsername',
      score: 0,
      played: 0,
      wins: 0,
    };

    beforeEach(() => {
      updateUserDto = {
        username: 'newUsername',
        password: 'newPassword',
      };
    });

    it('should update the user successfully', async () => {
      userModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(dbUser),
      });

      const user = {
        ...dbUser,
        save: jest.fn().mockResolvedValue({
          ...dbUser,
          username: 'newUsername',
          hashedPassword: 'hashedPassword',
        }),
      };

      userModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      usersService['hashPassword'] = jest
        .fn()
        .mockResolvedValue('hashedPassword');

      const result = await usersService.updateUser(userId, updateUserDto);

      expect(userModel.findById).toHaveBeenCalledWith(userId);
      expect(usersService['hashPassword']).toHaveBeenCalledWith('newPassword');
      expect(user.save).toHaveBeenCalled();
      expect(result).toEqual(expectedUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      userModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        usersService.updateUser(userId, updateUserDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException if a general error occurs', async () => {
      userModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(
        usersService.updateUser(userId, updateUserDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('removeUser', () => {
    const userId = new Types.ObjectId('66f8f7fb027b5bb2be6d0dd9');

    it('should remove a user successfully', async () => {
      userModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(dbUser),
      });

      userModel.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });

      const result = await usersService.removeUser(userId, true);

      expect(userModel.findById).toHaveBeenCalledWith(userId);
      expect(userModel.deleteOne).toHaveBeenCalledWith({ _id: userId });
      expect(result).toEqual({ message: 'User account permanently deleted.' });
    });

    it('should throw NotFoundException if user is not found', async () => {
      userModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(usersService.removeUser(userId, false)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
