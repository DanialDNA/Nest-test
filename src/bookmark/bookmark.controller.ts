import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { User } from 'src/user/user.decorator';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) {}


    @Get()
    getBookmarks() {
        return this.bookmarkService.getBookmarks(null)
    }

    @Get('/:id')
    getBookmark(@Param('id') id: string) {
        // convert id to integer
        return this.bookmarkService.getBookmarks(+id)

    }

    @Post()
    createBookmark(@Body() body: CreateBookmarkDto, @User('userId') userId) {        
        body['userId'] = userId;                        
        return this.bookmarkService.craeteBookmark(body)
    }

    @Patch()
    updateBookmark(@Body() body: UpdateBookmarkDto) {
        console.log(body);
        
        return this.bookmarkService.updateBookmark(body);
    }

}
