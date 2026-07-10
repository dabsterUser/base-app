import { Controller, Get, Post, Body, UseGuards, Param, Put } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseGuard } from '../auth/supabase.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { CheckPermission } from '../auth/permissions.decorator';

@Controller('settings')
@UseGuards(SupabaseGuard, PermissionsGuard)
export class SettingsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @CheckPermission('settings.view')
  async getSettings() {
    return this.prisma.setting.findMany();
  }

  @Put(':key')
  @CheckPermission('settings.edit')
  async updateSetting(@Param('key') key: string, @Body('value') value: string) {
    return this.prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  @Get('group/:group')
  @CheckPermission('settings.view')
  async getByGroup(@Param('group') group: string) {
    return this.prisma.setting.findMany({ where: { group } });
  }
}
