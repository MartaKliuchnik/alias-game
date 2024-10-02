import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { UserSafeDto } from '../dto/user-safe.dto';

import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { userStub } from './stubs/user.stub';
import { mockAuthGuard } from '../__mocks__/auth.guard.mock';
import { AuthGuard } from '../../auth/gurards/auth.guard';
import { UpdateUserDto } from '../dto/update-user.dto';

jest.mock('../users.service');

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    describe('when the findAll method is called', () => {
      let users: UserSafeDto[];

      beforeEach(async () => {
        users = await usersController.findAll();
      });

      test('then it should call usersService.getUsers', () => {
        expect(usersService.getUsers).toHaveBeenCalled();
      });

      test('then it should return an array of users', () => {
        expect(users).toEqual([userStub()]);
      });
    });
  });

  describe('findOne', () => {
    describe('when the findOne method is called with a valid user ID', () => {
      let user: UserSafeDto;

      beforeEach(async () => {
        user = await usersController.findOne(
          new Types.ObjectId(userStub().userId),
        );
      });

      test('then it should call usersService.getUserById with the correct ID', () => {
        expect(usersService.getUserById).toHaveBeenCalledWith(
          new Types.ObjectId(userStub().userId),
        );
      });

      test('then it should return the corresponding user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  describe('remove', () => {
    describe('when the remove method is called', () => {
      let response: { message: string };

      beforeEach(async () => {
        response = await usersController.remove(
          new Types.ObjectId(userStub().userId),
          'true',
        );
      });

      test('then it should call usersService.removeUser with the correct parameters', () => {
        expect(usersService.removeUser).toHaveBeenCalledWith(
          new Types.ObjectId(userStub().userId),
          true,
        );
      });

      test('then it should return a success message when the user is successfully deleted', () => {
        expect(response).toEqual({
          message: 'User account permanently deleted.',
        });
      });
    });
  });

  describe('update', () => {
    describe('when the update method is called', () => {
      let user: UserSafeDto;
      let updateUserDto: UpdateUserDto;

      beforeEach(async () => {
        updateUserDto = {
          username: 'Markus',
        };
        user = await usersController.update(
          new Types.ObjectId(userStub().userId),
          updateUserDto,
        );
      });

      test('then it should usersService.updateUser with the correct parameters', () => {
        expect(usersService.updateUser).toHaveBeenCalledWith(
          new Types.ObjectId(userStub().userId),
          updateUserDto,
        );
      });

      test('then it should return the updated user object on successful update', () => {
        expect(user).toEqual(userStub());
      });
    });
  });
});
