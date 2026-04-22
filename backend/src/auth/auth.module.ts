import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminGuard } from './guards/admin.guard';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'kaizen_secret_key_2026',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, AdminGuard],
  controllers: [AuthController],
  exports: [AuthService, AdminGuard, JwtModule],
})
export class AuthModule {}
