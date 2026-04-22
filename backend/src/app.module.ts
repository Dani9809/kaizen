import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { GamificationModule } from './gamification/gamification.module';
@Module({
  imports: [HealthModule, PrismaModule, AuthModule, AdminModule, GamificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
