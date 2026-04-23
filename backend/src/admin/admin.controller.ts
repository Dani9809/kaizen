import { Controller, Get, Post, Patch, Delete, Param, Body, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreatePlayerDto } from './dto/create-player.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateSubscriptionTierDto } from './dto/update-subscription-tier.dto';
import { UpdateMoodDto } from './dto/update-mood.dto';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard/stats')
  async getStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('metadata')
  async getMetadata() {
    return this.adminService.getAdminMetadata();
  }

  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    return this.adminService.checkUsername(username);
  }

  @Get('users')
  async getUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getAllUsers(Number(page) || 1, Number(limit) || 10);
  }

  @Get('users/:id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getUserDetails(id);
  }

  @Post('users')
  async createPlayer(@Body() dto: CreatePlayerDto) {
    return this.adminService.createPlayer(dto);
  }

  @Patch('users/:id')
  async updatePlayer(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreatePlayerDto>,
  ) {
    return this.adminService.updatePlayer(id, dto);
  }

  @Patch('users/:id/status')
  async updateUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status_id', ParseIntPipe) statusId: number,
  ) {
    return this.adminService.updateUserStatus(id, statusId);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteUser(id);
  }

  @Get('groups')
  async getGroups(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getAllGroups(Number(page) || 1, Number(limit) || 10);
  }

  @Get('groups/:id')
  async getGroup(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getGroupDetails(id);
  }

  @Patch('groups/:id')
  async updateGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any,
  ) {
    return this.adminService.updateGroup(id, dto);
  }

  @Post('groups')
  async createGroup(@Body() dto: CreateGroupDto) {
    return this.adminService.createGroup(dto);
  }

  @Get('roles')
  async getRoles() {
    return this.adminService.getAllRoles();
  }

  @Post('groups/:id/members/bulk')
  async addMembersBulk(
    @Param('id', ParseIntPipe) groupId: number,
    @Body('members') members: { account_id: number, role_id: number }[],
  ) {
    return this.adminService.bulkAddGroupMembers(groupId, members);
  }

  @Patch('groups/members/:memberId')
  async updateMember(
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body('role_id', ParseIntPipe) roleId: number,
  ) {
    return this.adminService.updateGroupMember(memberId, roleId);
  }

  @Delete('groups/members/:memberId')
  async removeMember(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.adminService.removeGroupMember(memberId);
  }
  
  @Get('subscriptions/tiers')
  async getSubscriptionTiers() {
    return this.adminService.getAllSubscriptionTiers();
  }

  @Post('subscriptions/tiers')
  async createSubscriptionTier(@Body() dto: UpdateSubscriptionTierDto) {
    return this.adminService.createSubscriptionTier(dto);
  }

  @Patch('subscriptions/tiers/:id')
  async updateSubscriptionTier(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubscriptionTierDto,
  ) {
    return this.adminService.updateSubscriptionTier(id, dto);
  }

  @Delete('subscriptions/tiers/:id')
  async deleteSubscriptionTier(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteSubscriptionTier(id);
  }

  @Get('gamification/mood')
  async getMoods() {
    return this.adminService.getAllMoods();
  }

  @Post('gamification/mood')
  async createMood(@Body() dto: UpdateMoodDto) {
    return this.adminService.createMood(dto);
  }

  @Patch('gamification/mood/:id')
  async updateMood(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMoodDto,
  ) {
    return this.adminService.updateMood(id, dto);
  }

  @Delete('gamification/mood/:id')
  async deleteMood(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteMood(id);
  }
}
