import { Test } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { Connection, Types } from 'mongoose';
import * as request from 'supertest';
import { DatabaseService } from '../../../database/database.service';
import { createWordStub } from '../stubs/create-word.stub';
import { createWordsStub } from '../stubs/create-words.stub';
import { updateWordStub } from '../stubs/update-word.stub';

describe('WordsController (integration)', () => {
  const createWord = createWordStub();
  const updateWord = updateWordStub();
  const words = createWordsStub();
  let dbConnection: Connection;
  let httpServer: any;
  let app: any;

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
    await dbConnection.collection('words').deleteMany({});
  });

  describe('POST /words', () => {
    it('should create a new word successfully', async () => {
      const response = await request(httpServer)
        .post('/words')
        .send(createWord)
        .expect(201);

      expect(response.body).toMatchObject(createWord);

      const createdWord = await dbConnection
        .collection('words')
        .findOne({ word: createWord.word });
      expect(createdWord).toBeTruthy();
    });

    it('should return 400 if the word already exists', async () => {
      await request(httpServer).post('/words').send(createWord).expect(201);

      // Attempt to create a duplicate
      const response = await request(httpServer)
        .post('/words')
        .send(createWord)
        .expect(400);

      expect(response.body.message).toEqual(
        `Word '${createWord.word}' already exists.`,
      );
    });
  });

  describe('GET /words/:wordId', () => {
    it('should return a word successfully by wordId', async () => {
      // Create a test word
      const createResponse = await request(httpServer)
        .post('/words')
        .send(createWord)
        .expect(201);

      const createdWordId = createResponse.body._id;

      // Perform request to get the word by its ID
      const response = await request(httpServer)
        .get(`/words/${createdWordId}`)
        .expect(200);

      // Check that the retrieved word matches the created word
      expect(response.body).toMatchObject(createWord);
    });

    it('should return 404 if the word does not exist', async () => {
      const nonExistentWordId = new Types.ObjectId().toHexString();

      // Perform request with a non-existent ID
      const response = await request(httpServer)
        .get(`/words/${nonExistentWordId}`)
        .expect(404);

      // Update expectation for the actual message
      expect(response.body.message).toEqual(
        `Word with ID '${nonExistentWordId}' not found.`,
      );
    });
  });

  describe('GET /words', () => {
    it('should return an array of words successfully', async () => {
      // Insert test words into the database
      await dbConnection.collection('words').insertMany(words);

      // Perform request to get all words
      const response = await request(httpServer).get('/words').expect(200);

      // Convert the _id fields to strings in the response and expected words
      const wordsWithStringIds = response.body.map((word: any) => ({
        ...word,
        _id: word._id.toString(),
      }));

      const expectedWords = words.map((word) => ({
        ...word,
        _id: expect.any(String), // Expect any string as _id
      }));

      // Check that the returned array contains the created words
      expect(wordsWithStringIds).toEqual(expect.arrayContaining(expectedWords));
    });

    it('should return an empty array if no words exist', async () => {
      // Remove all records from the collection before the test
      await dbConnection.collection('words').deleteMany({});

      // Perform request to get all words
      const response = await request(httpServer).get('/words').expect(200);

      // Check that an empty array is returned
      expect(response.body).toEqual([]);
    });
  });

  describe('PATCH /words/:wordId', () => {
    it('should update a word successfully', async () => {
      // Create a test word
      const createResponse = await request(httpServer)
        .post('/words')
        .send(createWord)
        .expect(201);

      const createdWordId = createResponse.body._id;

      const updateResponse = await request(httpServer)
        .patch(`/words/${createdWordId}`)
        .send(updateWord)
        .expect(200);

      // Check that the updated word is correctly returned
      expect(updateResponse.body).toMatchObject(updateWord);

      // Check that the word is updated in the database
      const updatedWord = await dbConnection
        .collection('words')
        .findOne({ _id: new Types.ObjectId(createdWordId) });

      expect(updatedWord).toMatchObject(updateWord);
    });

    it('should return 404 if the word does not exist', async () => {
      const nonExistentWordId = new Types.ObjectId().toHexString();

      const updateWordDto = {
        word: 'nonExistentWord',
        similarWords: ['none'],
      };

      // Attempt to update a non-existent word
      const response = await request(httpServer)
        .patch(`/words/${nonExistentWordId}`)
        .send(updateWordDto)
        .expect(404);

      expect(response.body.message).toEqual(
        `Word with ID '${nonExistentWordId}' not found.`,
      );
    });
  });

  describe('DELETE /words/:wordId', () => {
    it('should remove a word successfully', async () => {
      // Create a test word
      const createResponse = await request(httpServer)
        .post('/words')
        .send(createWord)
        .expect(201);

      const createdWordId = createResponse.body._id;

      // Delete the word
      const deleteResponse = await request(httpServer)
        .delete(`/words/${createdWordId}`)
        .expect(200);

      // Check that the response contains a success message
      expect(deleteResponse.body.message).toEqual(`Word successfully deleted.`);

      // Check that the word is actually deleted from the database
      const deletedWord = await dbConnection
        .collection('words')
        .findOne({ _id: new Types.ObjectId(createdWordId) });

      expect(deletedWord).toBeNull();
    });

    it('should return 404 if the word does not exist', async () => {
      const nonExistentWordId = new Types.ObjectId().toHexString();

      // Attempt to delete a non-existent word
      const response = await request(httpServer)
        .delete(`/words/${nonExistentWordId}`)
        .expect(404);

      expect(response.body.message).toEqual(
        `Word with ID '${nonExistentWordId}' not found.`,
      );
    });
  });

  describe('POST /words/:wordId/check-answer', () => {
    it('should return true for a correct answer', async () => {
      const createResponse = await request(httpServer)
        .post('/words')
        .send(createWord)
        .expect(201);

      const createdWordId = createResponse.body._id;

      const response = await request(httpServer)
        .post(`/words/${createdWordId}/check-answer`)
        .send({ answer: createWord.word })
        .expect(201);

      expect(response.body).toEqual({ correct: true });
    });

    it('should return false for an incorrect answer', async () => {
      const createResponse = await request(httpServer)
        .post('/words')
        .send(createWord)
        .expect(201);

      const createdWordId = createResponse.body._id;

      const response = await request(httpServer)
        .post(`/words/${createdWordId}/check-answer`)
        .send({ answer: 'wrong-answer' })
        .expect(201);

      expect(response.body).toEqual({ correct: false });
    });
  });

  describe('POST /words/:id/check-description', () => {
    let wordId: Types.ObjectId;

    beforeEach(async () => {
      const createResponse = await request(httpServer)
        .post('/words')
        .send(createWord)
        .expect(201);

      wordId = createResponse.body._id; // Store the created word's ID
    });

    it('should return correct if the description is valid', async () => {
      const descriptionToCheck = 'This is valid description.';

      const response = await request(httpServer)
        .post(`/words/${wordId}/check-description`)
        .send({ description: descriptionToCheck })
        .expect(201);

      expect(response.body).toEqual({ correct: true });
    });

    it('should return correct as false if the description is invalid', async () => {
      const descriptionToCheck = 'This invalid description with example.';

      // Assuming your checkDescription method returns false for this description
      const response = await request(httpServer)
        .post(`/words/${wordId}/check-description`)
        .send({ description: descriptionToCheck })
        .expect(201);

      expect(response.body).toEqual({ correct: false });
    });

    it('should return 404 if the word does not exist', async () => {
      const nonExistentWordId = new Types.ObjectId().toHexString();
      const descriptionToCheck = 'Some description.';

      const response = await request(httpServer)
        .post(`/words/${nonExistentWordId}/check-description`)
        .send({ description: descriptionToCheck })
        .expect(404);

      expect(response.body.message).toEqual(
        `Word with ID '${nonExistentWordId}' not found.`,
      );
    });
  });
});
