import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserSafeDto } from './dto/user-safe.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ArchievedUserDocument,
  ArchivedUser,
} from './schemas/archieved-user.schema';

// UsersService responsible for handling user-related operations.
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(ArchivedUser.name)
    private archievedUserModel: Model<ArchievedUserDocument>,
  ) {}

  /**
   * Create a new client
   * @param {CreateUserDto} createUserDto - The DTO containing user creation data
   * @returns {Promise<User>} - A promise that resolves to the created User object
   * @throws {ConflictException} - If the username is already in use
   * @throws {InternalServerErrorException} - If an error occurs during the database operation
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    const existingUser = await this.userModel.findOne({ username }).exec();
    if (existingUser) {
      throw new ConflictException('Username already in use.');
    }

    // Fake hashing
    const salt = '1wefr456';
    const hashedPassword = `Hashed${password}`;

    const newUser = new this.userModel({ username, hashedPassword, salt });
    return newUser.save();
  }

  /**
   * Retrieves all users and maps them to a safe DTO format.
   * @returns {Promise<UserSafeDto[]>} - A promise that resolves to an array of UserSafeDto objects.
   * @throws {InternalServerErrorException} - If an error occurs during the database operation.
   */
  async findAll(): Promise<UserSafeDto[]> {
    try {
      const users = await this.userModel.find().exec();

      return users.map((user) => this.mapToSafeDto(user));
    } catch {
      throw new InternalServerErrorException(
        'An unexpected error occurred while retrieving the user list.',
      );
    }
  }

  /**
   * Retrieves a user by ID and maps them to a safe DTO format.
   * @param {Types.ObjectId} userId - The ID of the user to retrieve.
   * @returns {Promise<UserSafeDto>} - A promise that resolves to the UserSafeDto.
   * @throws {NotFoundException} - If no user is found with the given ID.
   * @throws {InternalServerErrorException} - If an unexpected error occurs during the database operation.
   */
  async findOne(userId: Types.ObjectId): Promise<UserSafeDto> {
    try {
      const user = await this.findUserById(userId);
      return this.mapToSafeDto(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while retrieving the user.',
      );
    }
  }

  /**
   * Update the user's information.
   * @param {Types.ObjectId} userId - The ID of the user to update.
   * @param {UpdateUserDto} updateUserDto - The DTO containing the fields to update.
   * @returns {Promise<UserSafeDto>} - A promise that resolves to the updated user's safe DTO.
   * @throws {NotFoundException} - If the user is not found.
   * @throws {BadRequestException} - If no valid fields are provided for update.
   * @throws {ConflictException} - If the new username is already in use.
   * @throws {InternalServerErrorException} - If an unexpected error occurs during the database operation.
   */
  async update(userId: Types.ObjectId, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findUserById(userId);

      this.validateUpdateFields(updateUserDto);
      await this.checkUsernameAvailability(updateUserDto.username, userId);

      if (updateUserDto.username) {
        user.username = updateUserDto.username;
      }
      if (updateUserDto.password) {
        // Fake hashing
        user.hashedPassword = `hashedUpdatedPassword${updateUserDto.password}`;
        user.salt = 'saltForUpdatedPassword';
      }

      const updatedUser = await user.save();
      return this.mapToSafeDto(updatedUser);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while updating the user.',
      );
    }
  }

  /**
   * Removes a user from the database, either by hard deletion or soft deletion (archiving)
   * @param {Types.ObjectId} userId - The ID of the user to remove.
   * @param {boolean} isHardDelete - Flag to determine whether to perform a hard delete or soft delete.
   * @returns {Promise<{ message: string }>} - A promise that resolves to an object containing a success message.
   * @throws {NotFoundException} - If no user is found with the given ID.
   */
  async remove(userId: Types.ObjectId, isHardDelete: boolean) {
    const user = await this.findUserById(userId);

    if (isHardDelete) {
      // Perform a hard delete
      await this.userModel.deleteOne({ _id: userId });
      return { message: 'User account permanently deleted.' };
    }

    // Perform a soft delete
    const archievedUser = new this.archievedUserModel({
      ...user.toObject(),
      deletedAt: new Date(),
    });
    await archievedUser.save();
    await this.userModel.deleteOne({ _id: userId });
    return {
      message: 'User account soft deleted and moved to archive successfully.',
    };
  }

  /**
   * Maps a UserDocument to a UserSafeDto.
   * @param {UserDocument} user - The user document to map.
   * @returns {UserSafeDto} - The mapped UserSafeDto.
   */
  private mapToSafeDto(user: UserDocument): UserSafeDto {
    return {
      userId: user._id.toString(),
      username: user.username,
      score: user.score,
      played: user.played,
      wins: user.wins,
    };
  }

  /**
   * Finds a user by their ID in the database.
   * @param {Types.ObjectId} userId - The ID of the user to retrieve.
   * @returns {Promise<UserDocument>} - A promise that resolves to the UserDocument.
   * @throws {NotFoundException} - If no user is found with the given ID.
   */
  private async findUserById(userId: Types.ObjectId): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  /**
   * Validates the update fields provided in the DTO.
   * @param {UpdateUserDto} updateUserDto - The DTO containing the fields to update.
   * @throws {BadRequestException} - If neither username nor password is provided.
   */
  private validateUpdateFields(updateUserDto: UpdateUserDto): void {
    if (!updateUserDto.username && !updateUserDto.password) {
      throw new BadRequestException(
        'At least one field (username or password) is required for update.',
      );
    }
  }

  /**
   * Checks if the new username is available for use.
   * @param {string | undefined} newUsername - The new username to check for availability.
   * @param {Types.ObjectId} currentUserId - The ID of the current user (to allow keeping the same username).
   * @throws {ConflictException} - If the new username is already in use by another user.
   */
  private async checkUsernameAvailability(
    newUsername: string | undefined,
    currentUserId: Types.ObjectId,
  ): Promise<void> {
    if (newUsername) {
      const existingUser = await this.userModel
        .findOne({ username: newUsername })
        .exec();
      if (existingUser && !existingUser._id.equals(currentUserId)) {
        throw new ConflictException('Username already in use.');
      }
    }
  }

  // findLeaderboard() {
  //   return `This action returns the leaderboard`;
  // }
}
