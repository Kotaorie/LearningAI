import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'; 
import {GqlExecutionContext} from "@nestjs/graphql";
import { jwtConstants } from './constants';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const context = (GqlExecutionContext.create(ctx)).getContext()

        const token = this.extractTokenFromHeader(context.req);
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            context.req['user'] = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,
            });
        } catch {
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

}
