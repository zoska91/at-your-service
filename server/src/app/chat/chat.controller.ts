import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { HumanMessage } from '@langchain/core/messages';

import { ChatService } from './chat.service';
import { ClerkAuthGuard } from 'src/utils/clerk-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/whisper')
  @UseGuards(ClerkAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async whisper(
    @Req() req: Request & { userId: string },
    @UploadedFile() whisperDto: Express.Multer.File,
  ) {
    const userId = req.userId;
    if (!userId) throw new NotFoundException('User not found');
    await this.chatService.setOpenaiApiKey(userId);

    const text = await this.chatService.whisper(whisperDto);
    return text;
  }

  @Get('/text-to-audio')
  @UseGuards(ClerkAuthGuard)
  async streamAudio(
    @Req() req: Request & { userId: string },
    @Res() res: Response,
    @Body('text') text: string,
  ) {
    try {
      const userId = req.userId;
      if (!userId) throw new NotFoundException('User not found');
      await this.chatService.setOpenaiApiKey(userId);

      const messages = [new HumanMessage(text)];
      await this.chatService.answerStream(messages, res);
    } catch (error) {
      console.error('Error streaming audio:', error);
      res.status(500).send('Error generating audio');
    }
  }

  @Post('/chat-audio')
  @UseGuards(ClerkAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async chatAudio(
    @Req() req: Request & { userId: string },
    @Res() res: Response,
    @UploadedFile() whisperDto: Express.Multer.File,
  ) {
    try {
      const userId = req.userId;
      if (!userId) throw new NotFoundException('User not found');
      await this.chatService.setOpenaiApiKey(userId);

      const { text } = await this.chatService.whisper(whisperDto);
      const messages = await this.chatService.prepareMessages(text);

      this.chatService.answerStream(messages, res);
    } catch (error) {
      console.error('Error streaming audio:', error);
      res.status(500).send('Error generating audio');
    }
  }

  @Post('/message')
  @UseGuards(ClerkAuthGuard)
  async chat(
    @Res() res: Response,
    @Req() req: Request & { userId: string },
    @Body('userMsg') userMsg: string,
  ) {
    const userId = req.userId;
    if (!userId) throw new NotFoundException('User not found');
    await this.chatService.setOpenaiApiKey(userId);
    console.log(userMsg);

    const messages = await this.chatService.prepareMessages({
      userMsg,
    });

    const answer = this.chatService.answerText(messages);
    return res.json({ answer });
  }
}
