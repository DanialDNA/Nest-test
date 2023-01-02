import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Bookmark } from '@prisma/client';
import { retry } from 'rxjs';
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
            const updatedbBookmark = await this.prisma.bookmark.update({
                where: {
                    id: body.id
                },
                data: queryData
            })
            return {"success": true, updatedbBookmark}

        } catch (error) {
            console.log(error.code);
            if (error.code == "P2025") {
                throw new HttpException('bookmark not found', HttpStatus.NOT_FOUND)
            } else {
                return {"success": false, "message": error}

            }   
        }
    }

    async deleteBookmark(id: number) {
        try {
            const bookmark = await this.prisma.bookmark.delete({
                where: {
                    id: id
                }
            })
            return {"success": true, bookmark}

        } catch (error) {
            if (error.code === "P2025") {
                throw new HttpException('bookmark not found', HttpStatus.NOT_FOUND) 
            }
            return {"success": false, message: error}
        }
    }
}
