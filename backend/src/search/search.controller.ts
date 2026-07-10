import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseGuard } from '../auth/supabase.guard';

@Controller('search')
@UseGuards(SupabaseGuard)
export class SearchController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async search(@Query('q') q: string) {
    const [users, forms, logs] = await Promise.all([
      this.prisma.user.findMany({
        where: { email: { contains: q, mode: 'insensitive' } },
        take: 5
      }),
      this.prisma.form.findMany({
        where: { title: { contains: q, mode: 'insensitive' } },
        take: 5
      }),
      this.prisma.activityLog.findMany({
        where: { action: { contains: q, mode: 'insensitive' } },
        take: 5
      })
    ]);

    return { users, forms, logs };
  }
}
