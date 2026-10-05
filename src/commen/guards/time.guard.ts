import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class TimeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const currentHour = new Date().getHours();
    const request = context.switchToHttp().getRequest();
    request.currentHour = currentHour;
    return true;
  }
}
