import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { CreateGroupDto } from './dto/create-group.dto';
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
        account_updated: dto.account_updated || new Date()
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

  async getAllGroups() {
    return this.prisma.group.findMany({
      include: {
        _count: {
          select: { members: true }
        }
      },
      orderBy: { group_created: 'desc' }
    });
  }

  async getGroupDetails(id: number) {
    return this.prisma.group.findUnique({
      where: { group_id: id },
      include: {
        members: {
          include: {
            account: {
              select: {
                account_id: true,
                username: true,
                email: true,
              }
            },
            role: true
          }
        },
        task_templates: {
          include: {
            schedules: true,
            instances: {
              include: {
                status: true,
                member_logs: {
                  include: {
                    account: { select: { username: true } },
                    status: true
                  }
                }
              },
              orderBy: { due_date: 'desc' },
              take: 10
            }
          }
        },
        quest_instances: {
          include: {
            quest: true,
            member_logs: {
              include: {
                account: { select: { username: true } }
              }
            }
          },
          orderBy: { assigned_date: 'desc' },
          take: 10
        },
        pet_details: {
          include: {
            group_pet: {
              include: {
                pet: {
                  include: {
                    species: {
                      include: {
                        category: true,
                        level: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        inventory: {
          include: {
            item: true
          }
        }
      }
    });
  }

  async createGroup(dto: CreateGroupDto) {
    const { name, isSharable, members } = dto;
    console.log('Creating group with data:', JSON.stringify(dto));

    // Validation
    const ownerCount = members.filter(m => m.role_name === 'Owner').length;
    if (ownerCount !== 1) {
      console.error('Validation failed: Exactly one Owner is required');
      throw new Error('Exactly one Owner is required');
    }
    if (members.length < 2) {
      console.error('Validation failed: A squad must have at least 2 members');
      throw new Error('A squad must have at least 2 members');
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. Create Group
        const group = await tx.group.create({
          data: {
            group_name: name,
            isSharable: !!isSharable,
            group_streak: 0,
            longest_streak: 0,
          }
        });
        console.log('Group created with ID:', group.group_id);

        // 2. Fetch Role IDs
        const roles = await tx.role.findMany();
        const roleMap = roles.reduce((acc, r) => {
          acc[r.role_name] = r.role_id;
          return acc;
        }, {} as Record<string, number>);

        // 3. Create Group Members (Loop instead of createMany for better error handling)
        for (const member of members) {
          const roleId = roleMap[member.role_name];
          if (!roleId) {
            throw new Error(`Role "${member.role_name}" not found in database`);
          }

          console.log(`Adding member ${member.account_id} with role ${member.role_name} (${roleId})`);
          
          await tx.groupMember.create({
            data: {
              group_id: group.group_id,
              account_id: Number(member.account_id),
              role_id: roleId,
              joined_at: new Date()
            }
          });
        }

        console.log('Successfully created group and all members');
        return group;
      });
    } catch (error) {
      console.error('Error in createGroup transaction:', error.message, error.stack);
      throw error;
    }
  }

  async getAllRoles() {
    return this.prisma.role.findMany();
  }

  async addGroupMember(groupId: number, accountId: number, roleId: number) {
    // ... (logic remains same, calling the new bulk method internally or just keeping it for single adds)
    return this.bulkAddGroupMembers(groupId, [{ account_id: accountId, role_id: roleId }]);
  }

  async bulkAddGroupMembers(groupId: number, members: { account_id: number, role_id: number }[]) {
    return this.prisma.$transaction(async (tx) => {
      const results: any[] = [];
      const roles = await tx.role.findMany();
      const leaderRole = roles.find(r => r.role_name === 'Leader');

      for (const m of members) {
        const targetRole = roles.find(r => r.role_id === m.role_id);
        
        // Handle ownership swap if any of the new members is an owner
        if (targetRole?.role_name === 'Owner' && leaderRole) {
          await tx.groupMember.updateMany({
            where: { group_id: groupId, role: { role_name: 'Owner' } },
            data: { role_id: leaderRole.role_id }
          });
        }

        const member = await tx.groupMember.create({
          data: {
            group_id: groupId,
            account_id: m.account_id,
            role_id: m.role_id,
            joined_at: new Date()
          },
          include: { account: true, role: true }
        });
        results.push(member);
      }
      return results;
    });
  }

  async updateGroupMember(memberId: number, roleId: number) {
    const member = await this.prisma.groupMember.findUnique({
      where: { group_member_id: memberId }
    });
    if (!member) throw new Error('Member not found');

    return this.prisma.$transaction(async (tx) => {
      const targetRole = await tx.role.findUnique({ where: { role_id: roleId } });
      
      if (targetRole?.role_name === 'Owner') {
        const leaderRole = await tx.role.findFirst({ where: { role_name: 'Leader' } });
        // Demote existing owner(s) in this specific group
        if (leaderRole) {
          await tx.groupMember.updateMany({
            where: { 
              group_id: member.group_id, 
              role: { role_name: 'Owner' },
              group_member_id: { not: memberId } 
            },
            data: { role_id: leaderRole.role_id }
          });
        }
      }

      return tx.groupMember.update({
        where: { group_member_id: memberId },
        data: { role_id: roleId },
        include: {
          account: true,
          role: true
        }
      });
    });
  }

  async removeGroupMember(memberId: number) {
    return this.prisma.groupMember.delete({
      where: { group_member_id: memberId }
    });
  }
}
