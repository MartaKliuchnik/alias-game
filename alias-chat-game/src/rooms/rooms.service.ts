import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Room } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  async create(createRoomDto: CreateRoomDto) {
    const createdRoom = new this.roomModel(createRoomDto);
    try {
      return await createdRoom.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          `Room with name ${createRoomDto.name} already exists`,
        );
      }
      throw new InternalServerErrorException('Could not create room');
    }
  }

  async findAll() {
    return this.roomModel.find().exec();
  }

  async findOne(id: string) {
    this.validateId(id);
    const room = await this.roomModel.findById(id).exec();
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} is not found`);
    }
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    this.validateId(id);
    const updatedRoom = await this.roomModel
      .findByIdAndUpdate(id, updateRoomDto, { new: true })
      .exec();
    if (!updatedRoom) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return updatedRoom;
  }

  async delete(id: string) {
    this.validateId(id);
    const deletedRoom = await this.roomModel.findByIdAndDelete(id).exec();
    if (!deletedRoom) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
  }

  private validateId(id: string) {
    if (!mongoose.isValidObjectId(id))
      throw new BadRequestException('Invalid ID');
  }
}
