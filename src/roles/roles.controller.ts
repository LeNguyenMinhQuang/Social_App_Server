import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Message, User } from 'src/decorator/customize';
import { IUser } from 'src/datatype/datatype';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Message('Create a Role')
    @Post()
    create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
        return this.rolesService.create(createRoleDto, user);
    }

    @Message('Get all Roles with pagination')
    @Get()
    findAll(@Query() qs: string, @Query('page') page: string) {
        return this.rolesService.findAll(qs, +page);
    }

    @Message('Get a Role')
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.rolesService.findOne(id);
    }

    @Message('Update a Role')
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @User() user: IUser) {
        return this.rolesService.update(id, updateRoleDto, user);
    }

    @Message('Delete a Role')
    @Delete(':id')
    remove(@Param('id') id: string, @User() user: IUser) {
        return this.rolesService.remove(id, user);
    }

    @Message('Restore a Role')
    @Delete(':id')
    restore(@Param('id') id: string) {
        return this.rolesService.restore(id);
    }
}
