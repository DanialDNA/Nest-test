import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Bookmark } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService) {}

    async getBookmarks(id: number) {

        if (id !== null) {
            const bookmark: Bookmark = await this.prisma.bookmark.findUnique({
                where : {
                    id: id
                }
            })
            
            if (bookmark !== null) {
                return {'success': true, bookmark}
            } else {
                throw new HttpException('bookmark not found', HttpStatus.NOT_FOUND)
            }

        } else {
            const bookmarks: Bookmark[] = await this.prisma.bookmark.findMany({}) 
            return {'success': true, bookmarks}
        }
    }

    async craeteBookmark(body: CreateBookmarkDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: body.userId
            }
        })
        // check if user exist
        if (user !== null) {
            const newBookmark = await this.prisma.bookmark.create({
                data: {
                    title: body.title,
                    description: body.description,
                    link: body.link,
                    user: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            }) 
            return {'success': true, newBookmark}

        } else {
            return {"success": false, "message": "user noy found !"}

        } 
    }
    async updateBookmark(body: UpdateBookmarkDto) {
        const queryData = {}
        for (let i in body.fields) {
            queryData[i] = body.fields[i]
        }
    
        try {
            const bookmark = await this.prisma.bookmark.update({
                where: {
                    id: body.id
                },
                data: queryData
            })
            
            return {"success": true, "bookmark": bookmark}

        } catch (error) {
            console.log(error);
            return {"success": false, "message": error}
            
        }

        
    
    
    }


}
