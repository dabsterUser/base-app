import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
        return false;
    }

    // Fetch user with role
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { role: true }
    });

    if (!dbUser) {
      throw new ForbiddenException('User roles not found');
    }

    return requiredRoles.includes(dbUser.role?.name.toLowerCase());
  }
}
