import { Module } from '@nestjs/common';
import { FormsController } from './forms.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [FormsController],
})
export class FormsModule {}
