import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { SupabaseGuard } from '../auth/supabase.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('forms')
@UseGuards(SupabaseGuard, RolesGuard)
export class FormsController {
  constructor(private supabaseService: SupabaseService) {}

  @Get()
  async findAll() {
    const { data, error } = await this.supabaseService.getClient()
      .from('forms')
      .select('*');
    if (error) throw error;
    return data;
  }

  @Post()
  @Roles('admin')
  async create(@Body() body: any, @Request() req: any) {
    const { data, error } = await this.supabaseService.getClient()
      .from('forms')
      .insert([{ ...body, user_id: req.user.id }])
      .select();
    if (error) throw error;
    return data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const { data, error } = await this.supabaseService.getClient()
      .from('forms')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  @Post(':id/submissions')
  async submit(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('form_submissions')
      .insert([{ form_id: id, user_id: req.user.id, data: body }])
      .select()
      .single();

    if (error) throw error;

    // Create a notification for the form owner (simplified here as user_id of the form)
    const { data: formData } = await supabase
      .from('forms')
      .select('user_id, title')
      .eq('id', id)
      .single();

    if (formData) {
      await supabase
        .from('notifications')
        .insert([{
          user_id: formData.user_id,
          message: `New submission received for form: ${formData.title}`,
        }]);
    }

    return data;
  }
}
