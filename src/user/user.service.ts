import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getUser(id: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id
            }
        })
        if (user !== null) {
            return user
        } else {
            return {"success": false, "message": "user not found !"}
        }
    }
}
