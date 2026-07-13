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
        // Ensure default role exists
        let defaultRole = await this.prisma.role.findFirst({
          where: { name: { equals: 'user', mode: 'insensitive' } }
        });

        if (!defaultRole) {
          defaultRole = await this.prisma.role.create({
            data: { name: 'user', description: 'Default user role' }
          });
        }

        dbUser = await this.prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            roleId: defaultRole.id
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

    // Check role-based permissions
    const hasRolePermission = dbUser.role?.permissions.some(p => p.permission.name === requiredPermission);

    return !!hasRolePermission;
  }
}
