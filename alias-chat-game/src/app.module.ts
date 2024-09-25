import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { WordsModule } from './words/words.module';
import { RoomsModule } from './rooms/rooms.module';
import { TeamsModule } from './teams/teams.module';
import { ChatsModule } from './chats/chats.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://url'),
    UsersModule,
    TeamsModule,
    RoomsModule,
    WordsModule,
    MessagesModule,
    ChatsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
