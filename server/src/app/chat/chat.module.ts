import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ActionTypesModule } from '../db/actionTypes/actionTypes.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ActionTypesModule, UserModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
