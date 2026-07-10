import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseGuard } from '../auth/supabase.guard';

@Controller('dashboard')
@UseGuards(SupabaseGuard)
export class DashboardController {
  constructor(private prisma: PrismaService) {}

  @Get('stats')
  async getStats() {
    const [totalUsers, activeUsers, totalForms, totalSubmissions] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: 'active' } }),
      this.prisma.form.count(),
      this.prisma.formSubmission.count(),
    ]);

    const recentActivities = await this.prisma.activityLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });

    return {
      stats: { totalUsers, activeUsers, totalForms, totalSubmissions },
      recentActivities,
    };
  }
}
