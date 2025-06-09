import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Message, User } from 'src/decorator/customize';
import { IUser } from 'src/datatype/datatype';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Message('Create a Post')
    @Post()
    create(@Body() createPostDto: CreatePostDto, @User() user: IUser) {
        return this.postService.create(createPostDto, user);
    }

    @Message('Get all Posts')
    @Get()
    findAll(@Query() qs: string, @Query('page') page: string) {
        return this.postService.findAll(qs, +page);
    }

    @Message('Get a Post')
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postService.findOne(id);
    }

    @Message('Update a Post')
    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @User() user: IUser) {
        return this.postService.update(id, updatePostDto, user);
    }

    @Message('Delete a Post')
    @Delete(':id')
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.postService.remove(id, user);
    }

    @Message('Restore a Post')
    @Delete(':id')
    restore(@Param('id') id: string) {
        return this.postService.restore(id);
    }

    @Message('Like Post')
    @Patch(':id/like')
    likePost(@Param('id') id: string, @User() user: IUser) {
        return this.postService.likePost(id, user);
    }
}
