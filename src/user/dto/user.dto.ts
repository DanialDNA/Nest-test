import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class userDto { 
    @IsString()
    id: number;
}