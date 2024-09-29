import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

// describe('UsersService', () => {
//   let service: UsersService;
//   let userModel: Model<User>;
//   let archievedUserModel: Model<ArchivedUser>;

//   // const mockUserService = {
//   //   create: jest.fn(),
//   //   findById: jest.fn(),
//   //   findByIdAndUpdate: jest.fn(),
//   //   findByIdAndDelete: jest.fn(),
//   // };

//   const mockUserModel = {
//     findOne: jest.fn().mockReturnThis(),
//     create: jest.fn(),
//   };

//   const mockArchivedUserModel = {
//     create: jest.fn(),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UsersService,
//         {
//           provide: getModelToken(User.name),
//           useValue: mockUserModel,
//         },
//         {
//           provide: getModelToken(ArchivedUser.name),
//           useValue: mockArchivedUserModel,
//         },
//       ],
//     }).compile();

//     service = module.get<UsersService>(UsersService);
//     userModel = module.get<Model<User>>(getModelToken(User.name));
//   });

//   const mockUser = {
//     _id: new Types.ObjectId('66f8f7fb027b5bb2be6d0ddd'),
//     username: 'Mike',
//     hashedPassword:
//       '$2b$10$lJOGEPA8Bug0CUe7OFCfEunrVW7psxBnzxHRj4MysPZTOBkOqfFUK',
//     score: 0,
//     played: 0,
//     wins: 0,
//   };

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('create', () => {
//     it('should create and return a user when username is not taken', async () => {
//       const createUserDto: CreateUserDto = {
//         username: 'Mike',
//         password: 'JOGEPA8Bug0CU$',
//       };

//       mockUserModel.findOne.mockResolvedValue(null);
//       mockUserModel.create.mockResolvedValue(mockUser);

//       const spy = jest
//         .spyOn(mockUserModel, 'findOne')
//         .mockReturnThis()
//         .mockReturnValue({
//           exec: jest.fn().mockResolvedValue(createUserDto as CreateUserDto),
//         } as unknown as Query<UserDocument, any>);
//       await mockUserModel.findOne(mockUser._id);
//       expect(spy).toBeCalled();
//     });
//   });
// });
