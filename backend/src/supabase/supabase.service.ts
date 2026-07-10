import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_KEY');

    if (url && key) {
      this.supabase = createClient(url, key);
    } else {
      // Mock for development/testing when keys are missing
      this.supabase = {
        auth: {
          getUser: async (token: string) => ({ data: { user: { id: 'mock-id' } }, error: null }),
        },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: async () => ({ data: { id: 'mock-id', role: 'ADMIN' }, error: null }),
            }),
          }),
        }),
      } as any;
    }
  }

  getClient() {
    return this.supabase;
  }
}
