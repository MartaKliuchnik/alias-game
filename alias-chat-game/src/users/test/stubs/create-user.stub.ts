import { Types } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export const createUserStub = (): CreateUserDto => {
  return {
    username: 'testuser',
    password: 'testpassword',
  };
};

export const createDbUserStub = () => ({
  _id: new Types.ObjectId('66f8f7fb027b5bb2be6d0dd9'),
  username: 'testuser',
  hashedPassword:
    '$2b$10$sTwo3ikfhwswHJ6nRXAU1Ocm42E1VWJIA2o.aUnaFuIyJ1xRgmEO.',
  score: 0,
  played: 0,
  wins: 0,
});
