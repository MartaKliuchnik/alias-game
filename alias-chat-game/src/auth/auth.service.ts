import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth } from './schemas/auth.schema';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

/**
 * Service for user's authorization.
 */
@Injectable()
export class AuthService {
  constructor(
    /**
     * Model for user's auth data.
     */
    @InjectModel(Auth.name) private authModel: Model<Auth>,
    /**
     * JWT service for work with tokens.
     */
    private jwtService: JwtService,
    /**
     * Service for work with users.
     */
    private readonly usersService: UsersService,
  ) {}

  /**
   * Method for registering a new user.
   * @param {CreateUserDto} createUserDto Request body with user's data.
   * @returns {Promise<{
   * message: string;
   * data: { userId: string } }>} Message and user's ID.
   */
  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string; data: { userId: string } }> {
    const { userId } = await this.usersService.createUser(createUserDto);

    return {
      message: 'User registered successfully.',
      data: {
        userId: userId,
      },
    };
  }

  /**
   * Method for login into user's account.
   * @param {LoginDto} loginDto Request body with user's login data.
   * @returns {Promise<{
   * message: string;
   * data: {
   * access_token: string;
   * refresh_token: string }}>} Message and user's access and refresh tokens.
   */
  async login(loginDto: LoginDto): Promise<{
    message: string;
    data: {
      access_token: string;
      refresh_token: string;
    };
  }> {
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

  /**
   * Method for logging out of user's session.
   * @param {string} userId User's ID for logout.
   * @returns {Promise<{ message: string }>} Message on logout result.
   */
  async logout(userId: string): Promise<{ message: string }> {
    await this.authModel.deleteOne({ userId });
    return { message: 'User logged out successfully, refresh token deleted.' };
  }

  /**
   * Method for refreshing user's access token.
   * @param {RefreshTokenDto} refreshTokenDto Request body with user's refresh token.
   * @returns {Promise<{
   * message: string;
   * data: {
   * access_token: string }}>} Message and user's access token.
   */
  async refresh(refreshTokenDto: RefreshTokenDto): Promise<{
    message: string;
    data: {
      access_token: string;
    };
  }> {
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

  /**
   * Method for generating a new access token.
   * @param {string} userId User's ID for generating access token.
   * @returns {string} Access token string.
   */
  private generateAccessToken(userId: string): string {
    return this.jwtService.sign(
      { userId },
      { secret: 'AliasSecret', expiresIn: '1h' },
    );
  }

  /**
   * Method for generating a new refresh token and saving it to the DB.
   * @param {string} userId User's ID for refresh token.
   * @returns {Promise<string>} User's refresh token for getting new access tokens.
   */
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

  /**
   * Method for getting refresh token's payload bject.
   * @param {string} refreshToken - refresh token's string.
   * @returns {Promise<{userId:string}>} refresh token's payload decoded.
   */
  private async validateRefreshToken(
    refreshToken: string,
  ): Promise<{ userId: string }> {
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
