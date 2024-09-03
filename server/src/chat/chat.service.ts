import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';

import { Response } from 'express';

import * as FormData from 'form-data';

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

  async textToAudioStream(
    messages: HumanMessage[],
    openaiApiKey: string,
    res: Response,
  ): Promise<void> {
    const modelSettings = {
      modelName: 'gpt-4o-mini',
      temperature: 0.7,
      apiKey: openaiApiKey,
      streaming: true,
    };

    const configuration = {
      callbacks: [
        {
          handleLLMNewToken(token: string) {
            console.log({ token });
            res.write(token);
          },
          handleLLMEnd: async (output: any) => {
            const aiMessage = output.generations[0][0].text;
            console.log({ aiMessage });
            // saveMessage({ ...dataToSave, aiMessage });
            res.end();
          },
        },
      ],
    };

    const chat = new ChatOpenAI(modelSettings);
    const { content } = await chat.invoke(messages, configuration);
    console.log(content);
    // if (!isStreaming) {
    //   saveMessage({ ...dataToSave, aiMessage: content.toString() });
    //   res.json({ answer: content.toString() });
    // }
  }
}
