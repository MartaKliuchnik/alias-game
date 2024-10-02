import { CreateUserDto } from 'src/users/dto/create-user.dto';

export const createUserStub = (): CreateUserDto => {
  return {
    username: 'Mark',
    password: 'plainPasswordDrfff4%^&sds#3',
  };
};
