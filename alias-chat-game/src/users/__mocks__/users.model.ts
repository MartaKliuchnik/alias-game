export const mockUsersModel = () => ({
  findOne: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(null),
  }),
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  deleteOne: jest.fn(),
});
