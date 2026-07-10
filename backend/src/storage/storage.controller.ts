import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseGuard } from '../auth/supabase.guard';
import { SupabaseService } from '../supabase/supabase.service';
import { Response } from 'express';

@Controller('storage')
@UseGuards(SupabaseGuard)
export class StorageController {
  constructor(private supabase: SupabaseService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const { data, error } = await this.supabase.getClient()
      .storage
      .from('uploads')
      .upload(`${Date.now()}-${file.originalname}`, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw error;
    return data;
  }

  @Get('files')
  async listFiles() {
    const { data, error } = await this.supabase.getClient()
      .storage
      .from('uploads')
      .list();

    if (error) throw error;
    return data;
  }

  @Get(':path')
  async getFile(@Param('path') path: string, @Res() res: Response) {
    const { data, error } = await this.supabase.getClient()
      .storage
      .from('uploads')
      .download(path);

    if (error) throw error;

    const buffer = Buffer.from(await data.arrayBuffer());
    res.send(buffer);
  }
}
