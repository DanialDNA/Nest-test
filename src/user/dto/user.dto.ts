import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';



// private class
export class UpdateUserfieldsDto {
    @IsOptional()
    @IsEmail()
    email: string;
    
    @IsOptional()
    @IsString()
    username: string;
    
    @IsOptional()
    @IsString()
    firstName: string;
    
    @IsOptional()
    @IsString()
    lastName: string;

}


export class UpdateUserDto { 
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsObject()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => UpdateUserfieldsDto)
    fields: UpdateUserfieldsDto;


}