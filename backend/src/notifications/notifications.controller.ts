import { Controller, Get, UseGuards, Request, Patch, Param } from '@nestjs/common';
import { SupabaseGuard } from '../auth/supabase.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('notifications')
@UseGuards(SupabaseGuard)
export class NotificationsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req: any) {
    return this.prisma.notification.update({
      where: {
        id,
        userId: req.user.id
      },
      data: { read: true },
    });
  }
}
