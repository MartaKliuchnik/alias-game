import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';

@Injectable()
export class AuthService {
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
