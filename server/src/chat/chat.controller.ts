import {
  BadRequestException,
  Controller,
  Headers,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/whisper')
  @UseInterceptors(FileInterceptor('file'))
  async whisper(
    @UploadedFile() whisperDto: Express.Multer.File,
    @Headers('openai-api-key') openaiApiKey: string,
  ) {
    if (!openaiApiKey)
      throw new BadRequestException('openai API key is required');

    const text = await this.chatService.whisper(whisperDto, openaiApiKey);
    return text;
  }
}
