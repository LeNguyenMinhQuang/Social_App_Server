import { IsEmail, IsMongoId, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    userName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string;

    @IsNotEmpty()
    role: string;
}

export class RegisterUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    userName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string;
}
