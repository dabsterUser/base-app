import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class WsSupabaseGuard implements CanActivate {
  constructor(private supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.auth.token;

    if (!token) return false;

    const { data: { user }, error } = await this.supabase.getClient().auth.getUser(token);

    if (error || !user) return false;

    client.user = user;
    return true;
  }
}
