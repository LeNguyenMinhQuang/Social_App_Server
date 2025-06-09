import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Message, User } from 'src/decorator/customize';
import { IUser } from 'src/datatype/datatype';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Message('Create User')
    @Post()
    create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
        return this.usersService.create(createUserDto, user);
    }

    @Message('Get all User')
    @Get()
    findAll(@Query() qs: string, @Query('page') page: string) {
        return this.usersService.findAll(qs, +page);
    }

    @Message('Get User')
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Message('Update User')
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
        return this.usersService.update(id, updateUserDto, user);
    }

    @Message('Delete User')
    @Delete(':id')
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.usersService.remove(id, user);
    }

    @Message('Delete User')
    @Patch(':id/restore')
    restore(@Param('id') id: string) {
        return this.usersService.restore(id);
    }

    @Message('Unfollow User')
    @Patch(':receiverId/unfollow')
    unfollow(@Param('receiverId') receiverId: string, @User() user) {
        return this.usersService.unfollow(receiverId, user);
    }
}
