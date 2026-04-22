import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const totalUsers = await this.prisma.account.count({
      where: { type: { type_name: 'User' } }
    });
    const totalGroups = await this.prisma.group.count();
    
    const totalInstances = await this.prisma.userTaskInstance.count();
    const completedInstances = await this.prisma.userTaskInstance.count({
      where: { status: { status_name: 'Completed' } }
    });
    const completionRate = totalInstances > 0 ? (completedInstances / totalInstances) * 100 : 0;

    return {
      totalUsers,
      totalGroups,
      completionRate: Math.round(completionRate),
      activeQuests: await this.prisma.userQuest.count({ where: { quest_status: 'Pending' } })
    };
  }

  async getAllUsers() {
    return this.prisma.account.findMany({
      where: { type: { type_name: 'User' } },
      include: {
        status: true,
        tier: true,
      },
      orderBy: { account_created: 'desc' }
    });
  }

  async updateUserStatus(accountId: number, statusId: number) {
    return this.prisma.account.update({
      where: { account_id: accountId },
      data: { 
        account_status_id: statusId,
        account_updated: new Date()
      }
    });
  }

  async getUserDetails(id: number) {
    return this.prisma.account.findUnique({
      where: { account_id: id },
      include: {
        status: true,
        tier: true,
        type: true,
      },
    });
  }

  async updatePlayer(id: number, dto: Partial<CreatePlayerDto>) {
    const currentUser = await this.prisma.account.findUnique({ where: { account_id: id } });
    if (!currentUser) throw new Error('User not found');

    const updateData: any = { ...dto };
    
    if (dto.password) {
      const username = dto.username || currentUser.username;
      updateData.password = await bcrypt.hash(dto.password + username, 12);
    }

    return this.prisma.account.update({
      where: { account_id: id },
      data: {
        ...updateData,
        account_updated: new Date()
      },
      include: {
        status: true,
        tier: true,
        type: true,
      }
    });
  }

  async deleteUser(accountId: number) {
    return this.prisma.account.delete({
      where: { account_id: accountId }
    });
  }

  async getAdminMetadata() {
    const [types, statuses, tiers] = await Promise.all([
      this.prisma.type.findMany(),
      this.prisma.accountStatus.findMany(),
      this.prisma.subscriptionTier.findMany(),
    ]);

    return { types, statuses, tiers };
  }

  async checkUsername(username: string) {
    const user = await this.prisma.account.findUnique({
      where: { username }
    });
    return { available: !user };
  }

  async createPlayer(dto: CreatePlayerDto) {
    const existingUser = await this.prisma.account.findFirst({
      where: {
        OR: [
          { username: dto.username },
          { email: dto.email }
        ]
      }
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Rule: 12 rounds with username
    const hashedPassword = await bcrypt.hash(dto.password + dto.username, 12);

    return this.prisma.account.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        type_id: dto.type_id,
        account_status_id: dto.account_status_id,
        subscription_tier_id: dto.subscription_tier_id,
        currency_balance: dto.currency_balance,
        current_streak: 0,
        last_freeze_used_date: null,
        longest_streak: 0,
      },
      include: {
        status: true,
        tier: true,
        type: true
      }
    });
  }
}
