import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { signinDto, signupDto } from "./dto";
import * as argon from "argon2"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor (private prisma: PrismaService, private jwt: JwtService) {
    }
    async signup(body: signupDto) {
        // create hash password
        const hashedPassword = await argon.hash(body.password)

        // create user in database
        
        try {
            const user = await this.prisma.user.create({
                data: {
                    username: body.username,
                    email: body.email,
                    password: hashedPassword
                },
                // select: {
                //     username: true,
                //     email: true,
                //     createdAt: true
                // }
                
            });
            
            delete user.password;
            return user;
        
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
                throw new ForbiddenException("duplicate User")
            } else {
                throw error;
            }
        }        
    }
    async signin(body: signinDto) {
        // get user to check password 
        const user = await this.prisma.user.findFirst({
            where: {
                email: body.email
            }
        })
        if (user !== null) {
            const checkPassword = await argon.verify(user.password, body.password)
            if (checkPassword === true) {
                const payload = {username: user.username, sub: user.id}
                return {"success": true, "jwtToken": this.jwt.sign(payload)};
            } else {
                return {"success": false, "message": "password is wrong !"}
            }
        } else {
            return {"success": false, "message": "user not found !"}
        }
    }
}
