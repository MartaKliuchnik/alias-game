import { BadRequestException, Injectable } from '@nestjs/common';
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
    private readonly usersService: UsersService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<any> {
    const { userId } = await this.usersService.createUser(createUserDto);

    return {
      message: 'User registered successfully.',
      data: {
        userId: userId,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.usersService.checkAuth(username, password);

    const accessToken = this.generateAccessToken(user.userId);
    const refreshToken = await this.generateAndSaveRefreshToken(user.userId);

    return {
      message: 'User logged successfully.',
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    };
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.authModel.deleteOne({ userId }).exec();
    return { message: 'User logged out successfully, refresh token deleted.' };
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<any> {
    const { refreshToken } = refreshTokenDto;

    const payload = await this.validateRefreshToken(refreshToken);
    const userId = payload.userId;

    const accessToken = this.generateAccessToken(userId);
    return {
      message: 'Access token updated successfully.',
      data: {
        access_token: accessToken,
      },
    };
  }

  private generateAccessToken(userId: string): string {
    return this.jwtService.sign(
      { userId },
      { secret: 'AliasSecret', expiresIn: '1h' },
    );
  }

  private async generateAndSaveRefreshToken(userId: string): Promise<string> {
    const refreshToken = this.jwtService.sign(
      { userId },
      { secret: 'AliasSecret', expiresIn: '7d' },
    );

    await this.authModel.findOneAndUpdate(
      { userId },
      { refreshToken },
      { upsert: true, new: true },
    );

    return refreshToken;
  }

  private async validateRefreshToken(refreshToken: string) {
    const decoded = this.jwtService.verify(refreshToken, {
      secret: 'AliasSecret',
    });
    const authRecord = await this.authModel
      .findOne({ userId: decoded.userId })
      .exec();

    if (!authRecord || authRecord.refreshToken !== refreshToken) {
      throw new BadRequestException('Invalid refresh token');
    }

    return decoded;
  }
}
