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

    // Auto-seed required permission if it doesn't exist
    const permissionExists = await this.prisma.permission.findUnique({ where: { name: requiredPermission } });
    if (!permissionExists) {
      const [module, action] = requiredPermission.split('.');
      await this.prisma.permission.create({
        data: {
          name: requiredPermission,
          module: module || 'system',
          action: action || 'access'
        }
      });
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Fetch user with roles and permissions
    let dbUser = await this.prisma.user.findUnique({
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
      // Auto-create profile if missing (fallback for Supabase Auth users)
      try {
        const userCount = await this.prisma.user.count();
        const isFirstUser = userCount === 0;
        const roleName = isFirstUser ? 'super admin' : 'user';

        // Ensure role exists
        let role = await this.prisma.role.findFirst({
          where: { name: { equals: roleName, mode: 'insensitive' } }
        });

        if (!role) {
          role = await this.prisma.role.create({
            data: { name: roleName, description: `System generated ${roleName} role` }
          });
        }

        dbUser = await this.prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            roleId: role.id
          },
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
      } catch (e) {
        return false;
      }
    }

    // Check direct user permissions (User Permission > Role Permission)
    const directPermission = dbUser.permissions.find(p => p.permission.name === requiredPermission);
    if (directPermission) {
      return directPermission.type === 'allow';
    }

    // SUPER ADMIN BYPASS: Grant access if role name is super admin
    if (dbUser.role?.name.toLowerCase() === 'super admin') {
      return true;
    }

    // Check role-based permissions
    const hasRolePermission = dbUser.role?.permissions.some(p => p.permission.name === requiredPermission);

    return !!hasRolePermission;
  }
}
