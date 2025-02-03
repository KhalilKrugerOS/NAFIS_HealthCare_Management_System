import { 
    CanActivate, 
    ExecutionContext, 
    Injectable, 
    UnauthorizedException 
} from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { JwtService } from "@nestjs/jwt";
import { UserRoleEnum } from "src/enums/user-role.enum";
import { Request } from "express";
import { ROLES_KEY } from '../admin/admin.controller';

@Injectable()
export class RoleAccessControlGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Get roles from both handler and class
        const handlerRoles = this.reflector.get<UserRoleEnum[]>(ROLES_KEY, context.getHandler());
        const classRoles = this.reflector.get<UserRoleEnum[]>(ROLES_KEY, context.getClass());
        
        // Use handler roles if they exist, otherwise use class roles
        const requiredRoles = handlerRoles || classRoles;

        // If no roles are required, allow access
        if (!requiredRoles?.length) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromRequest(request);
        
        if (!token) {
            throw new UnauthorizedException('You must log in or sign up first.');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            
            request['user'] = payload;
            
            if (!requiredRoles.includes(payload.role)) {
                throw new UnauthorizedException("You do not have access to this resource");
            }
            console.log('required roles',requiredRoles);
            console.log(payload)
            return true;
        } catch {
            throw new UnauthorizedException();
        }
    }

    private extractTokenFromRequest(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === "Bearer" ? token : undefined;
    }
}