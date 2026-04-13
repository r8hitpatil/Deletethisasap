import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AtGuard extends AuthGuard('at-jwt') {
    constructor(private readonly reflector : Reflector){
        super();
    }

    canActivate(context:ExecutionContext){
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic',[
            context.getHandler(),
            context.getClass()
        ])

        if(isPublic) return true;

        const request = context.switchToHttp().getRequest();
        const token = request.cookies['access_token'];

        if (!token) {
            throw new UnauthorizedException('Token not found');
        }
        
        return super.canActivate(context);
    }
}