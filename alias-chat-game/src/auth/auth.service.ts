import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth } from './schemas/auth.schema';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<Auth>,
    private jwtService: JwtService,
  ) {}

  register(createUserDto: CreateUserDto) {
    return { message: 'User registered successfully.', data: createUserDto };
  }

  login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    UsersService.
    return { message: 'User logged successfully.', data: loginDto };
  }

  logout() {
    return { message: 'User logged out successfully.' };
  }

  refresh(refreshTokenDto: RefreshTokenDto) {
    return {
      message: 'Access token refreshed successfully.',
      data: refreshTokenDto,
    };
  }
}
