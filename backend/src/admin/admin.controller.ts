import { Controller, Get, Post, Patch, Delete, Param, Body, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreatePlayerDto } from './dto/create-player.dto';

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
  async getUsers() {
    return this.adminService.getAllUsers();
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
}
