import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseGuard } from '../auth/supabase.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { CheckPermission } from '../auth/permissions.decorator';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Controller('forms')
@UseGuards(SupabaseGuard, PermissionsGuard)
export class FormsController {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway
  ) {}

  @Get()
  @CheckPermission('forms.view')
  async findAll() {
    return this.prisma.form.findMany({
      include: { user: { select: { name: true, email: true } } }
    });
  }

  @Post()
  @CheckPermission('forms.create')
  async create(@Body() body: any, @Request() req: any) {
    const { fields, ...formData } = body;
    const form = await this.prisma.form.create({
      data: {
        ...formData,
        userId: req.user.id,
        fields: {
          create: fields.map((field: any, index: number) => {
            const { id, ...fieldData } = field;
            return {
              ...fieldData,
              order: index,
            };
          })
        }
      },
      include: { fields: true }
    });

    this.notificationsGateway.server.emit('notification', {
      type: 'system',
      message: `New form created: ${form.title}`,
      userId: req.user.id
    });

    return form;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.form.findUnique({
      where: { id },
      include: { fields: true }
    });
  }

  @Put(':id')
  @CheckPermission('forms.edit')
  async update(@Param('id') id: string, @Body() body: any) {
    const { fields, ...formData } = body;

    // Simple update logic: delete old fields and recreate new ones for versioning/simplicity
    await this.prisma.formField.deleteMany({ where: { formId: id } });

    return this.prisma.form.update({
      where: { id },
      data: {
        ...formData,
        fields: {
          create: fields.map((field: any, index: number) => {
            const { id, ...fieldData } = field;
            return {
              ...fieldData,
              order: index,
            };
          })
        }
      },
      include: { fields: true }
    });
  }
}
