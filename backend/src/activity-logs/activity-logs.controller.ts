import { Controller, Get, UseGuards } from '@nestjs/common';
import { SupabaseGuard } from '../auth/supabase.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('activity-logs')
@UseGuards(SupabaseGuard, RolesGuard)
export class ActivityLogsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @Roles('admin')
  async findAll() {
    return this.prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
