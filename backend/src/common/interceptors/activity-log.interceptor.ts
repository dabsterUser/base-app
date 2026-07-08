import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  constructor(private supabaseService: SupabaseService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, body } = request;

    return next.handle().pipe(
      tap(async () => {
        if (user && method !== 'GET') {
          await this.supabaseService.getClient()
            .from('activity_logs')
            .insert([{
              user_id: user.id,
              action: `${method} ${url}`,
              details: body,
            }]);
        }
      }),
    );
  }
}
