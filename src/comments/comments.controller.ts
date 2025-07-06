import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Message, User } from 'src/decorator/customize';
import { IUser } from 'src/datatype/datatype';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Message('Create a Comment')
    @Post()
    create(@Body() createCommentDto: CreateCommentDto, @User() user: IUser) {
        return this.commentsService.create(createCommentDto, user);
    }

    @Message('Get all Comments')
    @Get()
    findAll(@Query() qs: string, @Query('page') page: string) {
        return this.commentsService.findAll(qs, +page);
    }

    @Message('Get all comment by post')
    @Get('post/:postId')
    getByPost(@Param('postId') postId: string, @Query('page') page: string) {
        return this.commentsService.findByPost(postId, +page);
    }

    @Message('Get a Comment')
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.commentsService.findOne(id);
    }

    @Message('Update a Comment')
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @User() user: IUser) {
        return this.commentsService.update(id, updateCommentDto, user);
    }

    @Message('Delete a Comment')
    @Delete(':id')
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.commentsService.remove(id, user);
    }

    @Message('Restore a Comment')
    @Delete(':id')
    restore(@Param('id') id: string) {
        return this.commentsService.restore(id);
    }

    @Message('Like Comment')
    @Patch(':id/like')
    likeComment(@Param('id') id: string, @User() user: IUser) {
        return this.commentsService.likeComment(id, user);
    }
}
