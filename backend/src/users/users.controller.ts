import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseGuard } from '../auth/supabase.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { CheckPermission } from '../auth/permissions.decorator';

@Controller('users')
@UseGuards(SupabaseGuard, PermissionsGuard)
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @CheckPermission('users.view')
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    @Query('sort') sort: string = 'createdAt',
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as any } },
        { email: { contains: search, mode: 'insensitive' as any } },
      ]
    } : {};

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { [sort]: order },
        include: { role: true },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, total, page: parseInt(page), lastPage: Math.ceil(total / take) };
  }

  @Post()
  @CheckPermission('users.create')
  async create(@Body() body: any) {
    return this.prisma.user.create({ data: body });
  }

  @Put(':id')
  @CheckPermission('users.edit')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.prisma.user.update({
      where: { id },
      data: body,
    });
  }

  @Delete(':id')
  @CheckPermission('users.delete')
  async remove(@Param('id') id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
