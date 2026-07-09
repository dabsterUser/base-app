import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SupabaseGuard } from '../auth/supabase.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('users')
@UseGuards(SupabaseGuard, RolesGuard)
export class UsersController {
  constructor(private supabaseService: SupabaseService) {}

  @Get()
  @Roles('admin')
  async findAll() {
    // Joining with profiles to get the creator's email
    const { data, error } = await this.supabaseService.getClient()
      .from('profiles')
      .select(`
        *,
        creator:profiles!created_by_id(email)
      `);
    if (error) throw error;
    return data;
  }

  @Post()
  @Roles('admin')
  async create(@Body() body: any, @Request() req: any) {
    // In a real Supabase setup, you'd use admin auth to create the user
    // Here we just insert into profiles for demonstration
    const { data, error } = await this.supabaseService.getClient()
      .from('profiles')
      .insert([{
        ...body,
        created_by_id: req.user.id
      }])
      .select();
    if (error) throw error;
    return data;
  }
}
