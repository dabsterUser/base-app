import { Controller, Get, Post, Body, UseGuards, Request, Patch, Param } from '@nestjs/common';
import { SupabaseGuard } from '../auth/supabase.guard';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('notifications')
@UseGuards(SupabaseGuard)
export class NotificationsController {
  constructor(private supabaseService: SupabaseService) {}

  @Get()
  async findAll(@Request() req: any) {
    const { data, error } = await this.supabaseService.getClient()
      .from('notifications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req: any) {
    const { data, error } = await this.supabaseService.getClient()
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select();
    if (error) throw error;
    return data;
  }
}
