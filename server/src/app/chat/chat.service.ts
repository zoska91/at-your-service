import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';

import { Response } from 'express';

import * as FormData from 'form-data';
import { ActionTypesService } from '../db/actionTypes/actionTypes.service';
import { MessagesType } from 'types';
import { parseFunctionCall } from 'src/helpers/openai';

export const whisperApiEndpoint =
  'https://api.openai.com/v1/audio/transcriptions';

@Injectable()
export class ChatService {
  constructor(private readonly actionTypesService: ActionTypesService) {}

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

  async answerStream(
    messages: MessagesType,
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

    const chat = new ChatOpenAI({ ...modelSettings });
    await chat.invoke(messages, configuration);
  }

  async answerText(messages: MessagesType, openaiApiKey: string) {
    const parser = new StringOutputParser();

    const modelSettings = {
      modelName: 'gpt-4o-mini',
      temperature: 0.7,
      apiKey: openaiApiKey,
    };
    const model = new ChatOpenAI(modelSettings);

    const result = await model.invoke(messages);
    const answer = await parser.invoke(result);
    return answer;
  }

  async prepareMessages({ userMsg }: { userMsg: string }) {
    const currentActionType = this.getActionType(userMsg);

    return [new HumanMessage(userMsg)];
  }

  private async getActionType(userMsg: string) {
    const modelSettings = {
      modelName: 'gpt-4o-mini',
      temperature: 0.7,
    };

    const actionTypes = this.actionTypesService.findAll();
    const messages = [
      new SystemMessage(`As assistant, describe the user's intent.`),
      new HumanMessage(userMsg),
    ];

    const chat = new ChatOpenAI(modelSettings).bind({
      functions: [...intentionSchema],
      function_call: { name: 'describe_intention' } || undefined,
    });

    const result = await chat.invoke(messages);
    const intent = { ...parseFunctionCall(result) };
    console.log(intent);
    return intent;
  }
}
