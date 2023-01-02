import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest(); 
        const user: {'userId': number, "email": string} = request.user;
        return data ? user?.[data] : user;
    }
);