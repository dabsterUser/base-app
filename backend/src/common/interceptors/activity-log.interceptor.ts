import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';
import * as requestIp from 'request-ip';
import { UAParser } from 'ua-parser-js';

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, headers } = request;
    const ip = requestIp.getClientIp(request);
    const ua = new UAParser(headers['user-agent']).getResult();

    return next.handle().pipe(
      tap(async () => {
        const currentUser = request.user;
        if (currentUser && method !== 'GET') {
          try {
            await this.prisma.activityLog.create({
              data: {
                userId: currentUser.id,
                module: url.split('/')[1] || 'general',
                action: method,
                description: `User performed ${method} on ${url}`,
                ipAddress: ip,
                browser: `${ua.browser.name} ${ua.browser.version}`,
                device: ua.device.type || 'desktop',
                details: body,
              },
            });
          } catch (error) {
            console.error('Failed to log activity:', error);
          }
        }
      }),
    );
  }
}
