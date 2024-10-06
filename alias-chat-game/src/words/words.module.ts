import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WordsService } from './words.service';
import { WordsController } from './words.controller';
import { Word, WordSchema } from './schemas/word.schema';
import { TeamsModule } from '../teams/teams.module'; // Import TeamsModule
import { TeamsService } from 'src/teams/teams.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Word.name, schema: WordSchema }]),
    UsersModule,
    TeamsModule,
    JwtModule.register({
      secret: 'AliasSecret', // Ensure the same secret is used
      signOptions: { expiresIn: '1h' },
    }), // Register JwtModule with configuration
  ],
  controllers: [WordsController],
  providers: [WordsService, TeamsService],
})
export class WordsModule {}
