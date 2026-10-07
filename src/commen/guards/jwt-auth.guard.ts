import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

// Jwt auth guard
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflecter: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
