import { Controller, Get, UseGuards } from '@nestjs/common';
import { SupabaseGuard } from '../auth/supabase.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('activity-logs')
@UseGuards(SupabaseGuard, RolesGuard)
export class ActivityLogsController {
  constructor(private supabaseService: SupabaseService) {}

  @Get()
  @Roles('admin')
  async findAll() {
    const { data, error } = await this.supabaseService.getClient()
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
}
