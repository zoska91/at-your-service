import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ActionTypesModule } from '../db/actionTypes/actionTypes.module';

@Module({
  imports: [ActionTypesModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
