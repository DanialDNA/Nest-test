import { Controller, Get, Param } from '@nestjs/common';
import { userDto } from './dto';
import { UserService } from './user.service';


@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}
    
    @Get('/:id')
    getUser(@Param('id') id: string) {
        // convert id from string to int  
        return this.userService.getUser(+id)
    }
}
