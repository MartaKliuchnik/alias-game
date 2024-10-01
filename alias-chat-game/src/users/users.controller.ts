import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSafeDto } from './dto/user-safe.dto';
import { ParseObjectIdPipe } from '../parse-int.pipe';
import { Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/gurards/auth.guard';

// UsersController handles CRUD operations for user management.
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  /**
   * @route GET /api/v1/users
   * @description Retrieve all users
   * @access Private (Authenticated user)
   */
  @Get()
  async findAll(): Promise<UserSafeDto[] | []> {
    return this.usersService.getUsers();
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
    const user = await this.usersService.getUserById(userId);
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
  ): Promise<{ message: string }> {
    const isHardDelete = hardDelete === 'true';
    return this.usersService.removeUser(userId, isHardDelete);
  }

  /**
   * @route PATCH /api/v1/users/{userId}
   * @description Update the specified user
   * @access Private (Authenticated user)
   */
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserSafeDto> {
    return this.usersService.updateUser(id, updateUserDto);
  }
}
