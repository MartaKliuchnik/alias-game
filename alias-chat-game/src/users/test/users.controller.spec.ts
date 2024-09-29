import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { ParseObjectIdPipe } from '../../parse-int.pipe';
import { UserSafeDto } from '../dto/user-safe.dto';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    createUser: jest.fn(),
    getUsers: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    removeUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        ParseObjectIdPipe,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'Alex',
        password: 'SecurePass!123',
      };
      const expectedResult = {
        userId: '66f8f7fb027b5bb2be6d0ddd',
      };

      mockUsersService.createUser.mockResolvedValue(expectedResult);

      const result = await controller.create(createUserDto);

      expect(service.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expectedResult: UserSafeDto[] = [
        {
          userId: '66f8f7fb027b5bb2be6d0ddd',
          username: 'Alex',
          score: 0,
          played: 0,
          wins: 0,
        },
        {
          userId: '66f8f7fb027b5bb2be6d0dde',
          username: 'Mike',
          score: 10,
          played: 2,
          wins: 1,
        },
      ];

      mockUsersService.getUsers.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.getUsers).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = new Types.ObjectId('66f8f7fb027b5bb2be6d0ddd');
      const expectedResult: UserSafeDto = {
        userId: '66f8f7fb027b5bb2be6d0ddd',
        username: 'Alex',
        score: 0,
        played: 0,
        wins: 0,
      };

      mockUsersService.getUserById.mockResolvedValue(expectedResult);

      const result = await controller.findOne(userId);

      expect(service.getUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException when user is not found', async () => {
      const userId = new Types.ObjectId('66f8f7fb027b5bb2be6d0ddd');

      mockUsersService.getUserById.mockRejectedValue(
        new NotFoundException('User not found.'),
      );

      await expect(controller.findOne(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user when username is not exist', async () => {
      const userId = new Types.ObjectId('66f8f7fb027b5bb2be6d0ddd');
      const updateUser: UpdateUserDto = {
        username: 'Tomas',
        password: 'SecurePass!123',
      };
      const expectedResult: UserSafeDto = {
        userId: userId.toString(),
        username: 'Tomas',
        score: 0,
        played: 0,
        wins: 0,
      };

      mockUsersService.updateUser.mockResolvedValue(expectedResult);

      const result = await controller.update(userId, updateUser);

      expect(service.updateUser).toHaveBeenCalledWith(userId, updateUser);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove a user (soft delete)', async () => {
      const userId = new Types.ObjectId('66f8f7fb027b5bb2be6d0ddd');
      const expectedResult = {
        message: 'User account soft deleted and moved to archive successfully.',
      };

      mockUsersService.removeUser.mockResolvedValue(expectedResult);

      const result = await controller.remove(userId, 'false');

      expect(service.removeUser).toHaveBeenCalledWith(userId, false);
      expect(result).toEqual(expectedResult);
    });

    it('should remove a user (hard delete)', async () => {
      const userId = new Types.ObjectId('66f8f7fb027b5bb2be6d0ddd');
      const expectedResult = {
        message: 'User account permanently deleted.',
      };

      mockUsersService.removeUser.mockResolvedValue(expectedResult);

      const result = await controller.remove(userId, 'true');

      expect(service.removeUser).toHaveBeenCalledWith(userId, true);
      expect(result).toEqual(expectedResult);
    });
  });
});
