import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth } from './entities/auth.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';

@Injectable()
export class AuthService {

  constructor(@InjectModel(Auth.name) private authModel: Model<Auth>) {}

  register(createUserDto: CreateUserDto) {
    return { message: 'User registered successfully.' };
  }

  login(loginDto: LoginDto) {
    return { message: 'User logged successfully.' };
  }

  logout(logoutDto: LogoutDto) {
    return { message: 'User logged out successfully.' };
  }

  refresh(refreshTokenDto: RefreshTokenDto) {
    return { message: 'Access token refreshed successfully.' };
  }
}
