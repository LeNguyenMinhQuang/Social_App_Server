import { IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsArray()
    @IsMongoId({ each: true })
    permission: Types.ObjectId[];
}
