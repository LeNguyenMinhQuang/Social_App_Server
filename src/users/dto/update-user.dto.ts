import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    role: string;
    @IsOptional()
    fullName: string;
    @IsOptional()
    phone: string;
    @IsOptional()
    dateOfBirth: Date;
    @IsOptional()
    address: string;
    @IsOptional()
    bio: string;
    @IsOptional()
    gender: string;
    @IsOptional()
    avatar: string;
    @IsOptional()
    isPrivate: boolean;
}
