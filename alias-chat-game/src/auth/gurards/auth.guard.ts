import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const authToken = token.replace(/bearer/gim, '').trim();
      const payload = this.jwtService.verify(authToken, {
        secret: 'AliasSecret',
      });
      request.userId = payload.userId;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
