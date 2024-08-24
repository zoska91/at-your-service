import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import fetch from 'node-fetch';

export const whisperApiEndpoint =
  'https://api.openai.com/v1/audio/transcriptions';

@Injectable()
export class ChatService {
  constructor() {}

  async whisper(file: Express.Multer.File, openaiApiKey: string) {
    const formData = new FormData();

    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    const headers = {
      Authorization: `Bearer ${openaiApiKey}`,
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
