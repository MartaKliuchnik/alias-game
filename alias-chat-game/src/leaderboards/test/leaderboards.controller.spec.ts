import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardsController } from '../leaderboards.controller';
import { LeaderboardsService } from '../leaderboards.service';
import { UserSafeDto } from '../../users/dto/user-safe.dto';
import { leaderboardsStub } from './stubs/leaderboards.stub';

jest.mock('../leaderboards.service');

describe('LeaderboardsController', () => {
  let leaderboardsController: LeaderboardsController;
  let leaderboardsService: LeaderboardsService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [LeaderboardsController],
      providers: [LeaderboardsService],
    }).compile();

    leaderboardsController = moduleRef.get<LeaderboardsController>(
      LeaderboardsController,
    );
    leaderboardsService =
      moduleRef.get<LeaderboardsService>(LeaderboardsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    describe('when the findAll method is called', () => {
      let leaderboards: UserSafeDto[];

      beforeEach(async () => {
        leaderboards = await leaderboardsController.findAll();
      });

      test('then it should call leaderboardsService.getLeaderboards', () => {
        expect(leaderboardsService.getLeaderboards).toHaveBeenCalled();
      });

      test('then it should return an array of leaderboards', () => {
        expect(leaderboards).toEqual(leaderboardsStub());
      });
    });
  });
});
