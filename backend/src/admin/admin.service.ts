import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
      data: { account_status_id: statusId }
    });
  }

  async deleteUser(accountId: number) {
    // Note: ON DELETE CASCADE should handle related records if configured in Prisma
    return this.prisma.account.delete({
      where: { account_id: accountId }
    });
  }
}
