import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UpdateUserDto} from './dto';
import { UserService } from './user.service';


@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}
    
    @Get('/:id')
    getUser(@Param('id') id: string) {
        // convert id from string to int  
        return this.userService.getUser(+id)
    }

    @Patch()
    updateUser(@Body() body: UpdateUserDto) {
        return this.userService.updateUser(body);
        

    }
}
