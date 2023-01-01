import { Body, Controller, Get, Post, Param, UseGuards, HttpCode } from "@nestjs/common";
import { Public } from "src/utils";
import { AuthService } from "./auth.service";
import { signinDto, signupDto } from "./dto";

@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService) {
    }
    @Public()
    @Post('signup')
    signup(@Body() body: signupDto) {
    
        return this.authService.signup(body);    
    }

    @HttpCode(200)
    @Public()
    @Post('signin')
    signin(@Body() body: signinDto) {

        return this.authService.signin(body);    
    }
}