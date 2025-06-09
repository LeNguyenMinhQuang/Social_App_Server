import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCommentDto {
    // @IsNotEmpty()
    // @IsMongoId()
    // postId: Types.ObjectId;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    image: string;

    @IsOptional()
    location: string;
}
