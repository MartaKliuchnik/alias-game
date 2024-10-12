import { safeUserStub } from '../test/stubs/safe-user.stub';

export const UsersService = jest.fn().mockReturnValue({
  getUsers: jest.fn().mockResolvedValue([safeUserStub()]),
  getUserById: jest.fn().mockResolvedValue(safeUserStub()),
  updateUser: jest.fn().mockResolvedValue(safeUserStub()),
  removeUser: jest
    .fn()
    .mockResolvedValue({ message: 'User account permanently deleted.' }),
});
