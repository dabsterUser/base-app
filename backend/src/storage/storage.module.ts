import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [StorageController],
})
export class StorageModule {}
