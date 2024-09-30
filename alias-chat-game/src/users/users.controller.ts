import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserSafeDto } from './dto/user-safe.dto';
import { ParseObjectIdPipe } from 'src/parse-int.pipe';
import { Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';

// UsersController handles CRUD operations for user management.
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * @route POST /api/v1/users
   * @description Create a new user
   * @access Public
   */
  @Post()
  async create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  /**
   * @route GET /api/v1/users
   * @description Retrieve all users
   * @access Private (Authenticated user)
   */
  @Get()
  async findAll(): Promise<UserSafeDto[] | []> {
    return this.usersService.findAll();
  }

  /**
   * @route GET /api/v1/users/{userId}
   * @description Retrieve a specified user by id
   * @access Private (Authenticated user)
   */
  @Get(':userId')
  async findOne(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
  ): Promise<UserSafeDto | null> {
    const user = await this.usersService.findOne(userId);
    return user;
  }

  /**
   * @route DELETE /api/v1/users/{userId}
   * @description Delete a specified user by id (supports hard/soft delete)
   * @access Private (Authenticated user)
   */
  @Delete(':userId')
  async remove(
    @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
    @Query('hardDelete') hardDelete: string,
  ) {
    const isHardDelete = hardDelete === 'true';
    return this.usersService.remove(userId, isHardDelete);
  }

  /**
   * @route PATCH /api/v1/users/{userId}
   * @description Update the specified user
   * @access Private (Authenticated user)
   */
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }
}
