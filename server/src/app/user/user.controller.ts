import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { UserService } from './user.service';
import { ClerkAuthGuard } from 'src/utils/clerk-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/add-openai-api-key')
  @UseGuards(ClerkAuthGuard)
  async addApiKey(
    @Body('apiKey') apiKey: string,
    @Req() req: Request & { userId: string },
  ) {
    const userId = req.userId;
    if (!userId) throw new NotFoundException('User not found');

    await this.userService.saveOpenaiApiKey(userId, apiKey);
    return { message: 'API key stored successfully' };
  }

  @Get('get-openai-api-key')
  @UseGuards(ClerkAuthGuard)
  async getApiKey(
    @Req() req: Request & { userId: string },
    @Res() res: Response,
  ) {
    const userId = req.userId;
    if (!userId) throw new NotFoundException('User not found');

    const openaiApiKey = await this.userService.getOpenaiApiKey(userId);
    return res.json({ openaiApiKey });
  }
}
