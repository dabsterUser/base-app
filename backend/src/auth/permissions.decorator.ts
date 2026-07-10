import { SetMetadata } from '@nestjs/common';

export const CheckPermission = (permission: string) => SetMetadata('permission', permission);
