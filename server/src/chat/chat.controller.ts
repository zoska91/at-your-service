import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HumanMessage } from '@langchain/core/messages';

import { ChatService } from './chat.service';
import { Response } from 'express';

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

  @Get('/text-to-audio')
  async streamAudio(
    @Body('text') text: string,
    @Res() res: Response,
    @Headers('openai-api-key') openaiApiKey: string,
  ) {
    try {
      if (!openaiApiKey)
        throw new BadRequestException('openai API key is required');

      const messages = [new HumanMessage(text)];
      await this.chatService.textToAudioStream(messages, openaiApiKey, res);
    } catch (error) {
      console.error('Error streaming audio:', error);
      res.status(500).send('Error generating audio');
    }
  }

  @Post('/chat-audio')
  @UseInterceptors(FileInterceptor('file'))
  async chatAudio(
    @UploadedFile() whisperDto: Express.Multer.File,
    @Res() res: Response,
    @Headers('openai-api-key') openaiApiKey: string,
  ) {
    try {
      if (!openaiApiKey)
        throw new BadRequestException('openai API key is required');

      const { text } = await this.chatService.whisper(whisperDto, openaiApiKey);
      const messages = [new HumanMessage(text)];

      this.chatService.textToAudioStream(messages, openaiApiKey, res);
    } catch (error) {
      console.error('Error streaming audio:', error);
      res.status(500).send('Error generating audio');
    }
  }
}
