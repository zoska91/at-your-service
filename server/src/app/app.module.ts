import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { DatabaseModule } from 'db/database.module';
import { ChatModule } from './chat/chat.module';
import { ActionTypesModule } from './db/actionTypes/actionTypes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    ChatModule,
    DatabaseModule,
    ActionTypesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
