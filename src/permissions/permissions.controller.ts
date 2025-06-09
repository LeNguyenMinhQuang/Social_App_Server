import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Message, User } from 'src/decorator/customize';
import { IUser } from 'src/datatype/datatype';

@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) {}

    @Message('Create a Permission')
    @Post()
    create(@Body() createPermissionDto: CreatePermissionDto, @User() user: IUser) {
        return this.permissionsService.create(createPermissionDto, user);
    }

    @Message('Get all Permissions with pagination')
    @Get()
    findAll(@Query() qs: string, @Query('page') page: string) {
        return this.permissionsService.findAll(qs, +page);
    }

    @Message('Get a Permission')
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.permissionsService.findOne(id);
    }

    @Message('Update a Permission')
    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @User() user: IUser) {
        return this.permissionsService.update(id, updatePermissionDto, user);
    }

    @Message('Delete a Permission')
    @Delete(':id')
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.permissionsService.remove(id, user);
    }

    @Message('Restore a Permission')
    @Delete(':id')
    restore(@Param('id') id: string) {
        return this.permissionsService.restore(id);
    }
}
