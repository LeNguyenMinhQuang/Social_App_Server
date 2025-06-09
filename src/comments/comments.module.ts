import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comment.schemas';
import { UsersModule } from 'src/users/users.module';
import { PostModule } from 'src/posts/post.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]), UsersModule, PostModule],
    controllers: [CommentsController],
    providers: [CommentsService],
})
export class CommentsModule {}
