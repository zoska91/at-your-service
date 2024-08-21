import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import fetch from 'node-fetch';

export const whisperApiEndpoint =
  'https://api.openai.com/v1/audio/transcriptions';

@Injectable()
export class ChatService {
  constructor(private configService: ConfigService) {}

  async whisper(file: Express.Multer.File) {
    const apiKey = this.configService.get<string>('OPENAI_API_TOKEN');

    const formData = new FormData();

    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    const headers = {
      Authorization: `Bearer ${apiKey}`,
    };

    const response = await fetch(whisperApiEndpoint, {
      method: 'POST',
      body: formData,
      headers,
    });

    const text = await response.json();

    return text;
  }
}
