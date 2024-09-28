import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth } from './schemas/auth.schema';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Auth.name) private authModel: Model<Auth>) {}

  register(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return { message: 'User registered successfully.' };
  }

  login(loginDto: LoginDto) {
    console.log(loginDto);
    return { message: 'User logged successfully.' };
  }

  // logout(logoutDto: LogoutDto) {
  //   return { message: 'User logged out successfully.' };
  // }

  refresh(refreshTokenDto: RefreshTokenDto) {
    console.log(refreshTokenDto);
    return { message: 'Access token refreshed successfully.' };
  }
}
