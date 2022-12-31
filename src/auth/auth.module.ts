import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService }  from '@nestjs/config';
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt/jwt-auth.guard";
import { JwtStrategy } from "./jwt/jwt.strategy";

const config = new ConfigService()

@Module({
    imports: [JwtModule.register({
        secret: config.get("JWT_SECRET"),
        signOptions: {expiresIn: "60s"}
    })],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, {
        provide: APP_GUARD,
        useClass: JwtAuthGuard
    }],
    
})
export class AuthModule {}

