import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, MoreThan, Repository } from "typeorm";
import { RefreshToken } from "../entities/user-refresh-token.entity";

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repository: Repository<RefreshToken>,
  ) {}

  /**
   * 
   * @param userId 
   * @param token 
   * @param expiresAt 
   * @param ipAddress 
   * @param userAgent 
   * @returns 
   */
  async createToken(
    userId: string, 
    token: string, 
    expiresAt: Date, 
    ipAddress?: string, 
    userAgent?: string
  ): Promise<RefreshToken> {
    const refreshToken = this.repository.create({
      user: { userId: userId },
      token,
      expiresAt,
      ipAddress,
      userAgent,
      isRevoked: false,
    });
    return await this.repository.save(refreshToken);
  }

  /**
   * 
   * @param token 
   * @returns 
   */
  async findActiveUserRefreshToken(
    token: string, 
    userId: string
  ): Promise<RefreshToken> {
    return await this.repository.findOne({
      where: {
        user: { userId: userId },
        token,
        isRevoked: false, 
        expiresAt: MoreThan(new Date()),
      },
    });
  }

  /**
   * 
   * @param userId 
   */
  async revokeAllTokensForUser(
    userId: string
  ): Promise<void> {
    await this.repository.update(
      { user: { userId: userId } }, 
      { isRevoked: true }
    );
  }

  /**
   * 
   */
  async deleteExpiredTokens(): Promise<void> {
    await this.repository.delete({ expiresAt: LessThan(new Date()) });
  }
}