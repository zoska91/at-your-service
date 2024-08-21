import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { ChatService } from './chat.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/whisper')
  @UseInterceptors(FileInterceptor('file'))
  async whisper(@UploadedFile() whisperDto: Express.Multer.File) {
    const text = await this.chatService.whisper(whisperDto);
    return text;
  }
}
