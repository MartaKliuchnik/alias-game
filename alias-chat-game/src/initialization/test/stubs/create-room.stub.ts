import { CreateRoomDto } from 'src/rooms/dto/create-room.dto';

export const createRoom1Stub = (): CreateRoomDto => {
  return {
    name: 'Room1',
    teams: [],
    turnTime: 60,
  };
};

export const createRoom2Stub = (): CreateRoomDto => {
  return {
    name: 'Room2',
    teams: [],
    turnTime: 60,
  };
};
