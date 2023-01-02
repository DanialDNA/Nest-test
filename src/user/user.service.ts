import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto';

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

    async updateUser(body: UpdateUserDto) {
        const queryData = {}
        for (let i in body.fields) {
            queryData[i] = body.fields[i]
        }

        console.log(queryData);
        const updatedUser = await this.prisma.user.update({
            where: {
                id: body.id
            }, 
            data: queryData

        })
        return {'success': true, updatedUser}
    }
}
