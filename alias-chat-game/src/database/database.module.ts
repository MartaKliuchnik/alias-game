import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isTestEnvironment =
          configService.get<string>('NODE_ENV') === 'test';

        return {
          uri: isTestEnvironment
            ? `mongodb+srv://${configService.get<string>('MONGO_USERNAME')}:${configService.get<string>('MONGO_PASSWORD')}@alias1.odsrw.mongodb.net/${configService.get<string>('MONGO_TEST_DB')}?retryWrites=true&w=majority&appName=Alias1`
            : `mongodb+srv://${configService.get<string>('MONGO_USERNAME')}:${configService.get<string>('MONGO_PASSWORD')}@alias1.odsrw.mongodb.net/${configService.get<string>('MONGO_DB')}?retryWrites=true&w=majority&appName=Alias1`,
        };
      },
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
