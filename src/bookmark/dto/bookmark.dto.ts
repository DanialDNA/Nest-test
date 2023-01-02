import {IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsString, validate, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';


export class CreateBookmarkDto {
    @IsNotEmpty()
    @IsString()
    title: string
    
    @IsOptional()
    @IsString()
    description: string | undefined
    
    
    @IsNotEmpty()
    @IsString()
    link : string

    userId: number
    
}
// private class 
class updateFieldsDto {
    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    link: string;
}


export class UpdateBookmarkDto {
    @IsNotEmpty()
    @IsNumber()
    id: number

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => updateFieldsDto)
    fields: updateFieldsDto;

}