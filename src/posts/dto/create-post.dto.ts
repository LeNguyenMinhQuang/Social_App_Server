import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    emotion: null | 'happy' | 'sad' | 'angry' | 'horny';

    @IsOptional()
    images: string[];

    @IsOptional()
    isPublic: 'public' | 'onlyFans' | 'onlyMe';

    @IsOptional()
    location: string;

    @IsOptional()
    mentions: Types.ObjectId[];
}
