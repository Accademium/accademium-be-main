import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { RefreshToken } from "../entities/user-refresh-token.entity";
import { RefreshTokenRepository } from "../repositories/refresh-token.repository";

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly repository: RefreshTokenRepository,
  ) {}

    async createRefreshToken(
      userId: string, 
      token: string, 
      expiresAt: Date, 
      ipAddress?: string, 
      userAgent?: string
    ): Promise<RefreshToken> {
      await this.invalidateUserTokens(userId);
      return await this.repository.createToken(userId, token, expiresAt, ipAddress, userAgent);
    }
  
    async validateRefreshToken(
      token: string,
      userId: string,
    ): Promise<boolean> {
      const refreshToken = await this.repository.findActiveUserRefreshToken(token, userId);
      if (!refreshToken) throw new UnauthorizedException('Invalid or revoked refresh token');
      return true;
    }

    async invalidateUserTokens(userId: string) {
      await this.repository.revokeAllTokensForUser(userId);
    }
  
    async revokeAllRefreshTokensForUser(userId: string): Promise<void> {
      await this.repository.revokeAllTokensForUser(userId);
    }
  
    async deleteExpiredTokens(): Promise<void> {
      await this.repository.deleteExpiredTokens();
    }
}