import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(identifier: string, pass: string): Promise<any> {
    try {
      const user = await this.prisma.account.findFirst({
        where: { 
          OR: [
            { username: identifier },
            { email: identifier }
          ],
          type: { type_name: 'Admin' }
        },
        include: { type: true }
      });

      if (!user) {
        return null;
      }

      // Rule: 12 rounds with username (always use the database username for comparison)
      const isMatch = await bcrypt.compare(pass + user.username, user.password);
      
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async login(user: any) {
    const payload = { 
      username: user.username, 
      sub: user.account_id, 
      type: user.type?.type_name || 'Admin' 
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.account_id,
        username: user.username,
        type: user.type?.type_name
      }
    };
  }
}
