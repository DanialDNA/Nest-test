import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class signupDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;


    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    username: string;    
}

export class signinDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;


    @IsNotEmpty()
    @IsString()
    password: string;    
}
