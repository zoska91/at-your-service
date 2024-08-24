import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import { createClerkClient, ClerkClient } from '@clerk/clerk-sdk-node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private readonly encryptionKey: string;
  private readonly clerkClient: ClerkClient;

  constructor(private configService: ConfigService) {
    const encryptionKey = this.configService.get<string>('ENCRYPTION_KEY');
    const clerkKey = this.configService.get<string>('CLERK_SECRET_KEY');

    if (!encryptionKey)
      throw new InternalServerErrorException('Something is wrong. Sorry...');
    else this.encryptionKey = encryptionKey;

    if (!clerkKey)
      throw new InternalServerErrorException('Something is wrong. Sorry...');

    this.clerkClient = createClerkClient({ secretKey: clerkKey });
  }

  async saveOpenaiApiKey(userId: string, apiKey: string) {
    const encryptedApiKey = this.encrypt(apiKey, this.encryptionKey);

    await this.clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        encryptedApiKey,
      },
    });
  }

  async getOpenaiApiKey(userId: string): Promise<string> {
    const user = await this.clerkClient.users.getUser(userId);

    if (
      !user ||
      !user.privateMetadata ||
      !user.privateMetadata.encryptedApiKey
    ) {
      throw new NotFoundException('API key not found for the user.');
    }
    const encryptedApiKey = user.privateMetadata.encryptedApiKey as string;
    const decryptedApiKey = this.decrypt(encryptedApiKey, this.encryptionKey);

    return decryptedApiKey;
  }

  private encrypt(text: string, key: string): string {
    const ciphertext = CryptoJS.AES.encrypt(text, key).toString();
    return ciphertext;
  }

  private decrypt(text: string, key: string): string {
    const bytes = CryptoJS.AES.decrypt(text, key);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  }
}
