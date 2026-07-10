import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string>('permission', context.getHandler());
    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Fetch user with roles and permissions
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        },
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });

    if (!dbUser) {
      return false;
    }

    // Check direct user permissions (User Permission > Role Permission)
    const directPermission = dbUser.permissions.find(p => p.permission.name === requiredPermission);
    if (directPermission) {
      return directPermission.type === 'allow';
    }

    // Check role-based permissions
    const hasRolePermission = dbUser.role?.permissions.some(p => p.permission.name === requiredPermission);

    return !!hasRolePermission;
  }
}
