import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/**
 * Guard for user's authorization with access token.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  /**
   * Method for Auth guard's access token validation.
   * @param { ExecutionContext} context Context where guard's check is executed.
   * @returns {boolean} Is access token and valid.
   */
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
