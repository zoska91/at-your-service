import { createClerkClient } from '@clerk/clerk-sdk-node';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger();

  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext) {
    const clerkKey = this.configService.get<string>('CLERK_SECRET_KEY');
    const clerkClient = createClerkClient({ secretKey: clerkKey });

    const request = context.switchToHttp().getRequest();

    try {
      const user = await clerkClient.verifyToken(request.cookies.__session, {});
      if (user) {
        request.userId = user.sub;
        return true;
      }
    } catch (err) {
      this.logger.error(err);
      return false;
    }

    return true;
  }
}
