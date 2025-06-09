import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/datatype/datatype';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from './schemas/permission.schemas';
import { Model } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {
    constructor(@InjectModel(Permission.name) private permissionModel: Model<Permission>) {}
    async create(createPermissionDto: CreatePermissionDto, user: IUser) {
        const isExists = await this.permissionModel.findOne({
            apiPath: createPermissionDto.apiPath,
            method: createPermissionDto.method,
        });
        if (isExists) throw new BadRequestException(`This permission is already exists`);

        const res = await this.permissionModel.create({ ...createPermissionDto, createdBy: user?._id });
        if (res) {
            return {
                data: { _id: res._id, name: res.name },
            };
        } else {
            throw new InternalServerErrorException();
        }
    }

    async findAll(qs: string, page: number) {
        const { filter, sort } = aqp(qs);
        delete filter.page;

        const _filter = { ...filter, isDeleted: false };
        const _limit = 10;
        const _sort = sort ? sort : '-createdAt';
        const _skip = (page - 1) * _limit;
        const _select = ['_id', 'name', 'apiPath', 'method', 'module'];
        const _populate = [];

        const totalItems = (await this.permissionModel.find(_filter).exec()).length;
        const totalPages = Math.ceil(totalItems / _limit);

        const res = await this.permissionModel
            .find(_filter)
            .select(_select)
            .populate(_populate)
            .skip(_skip)
            .limit(_limit)
            .sort(_sort as any)
            .exec();
        if (res) {
            return {
                meta: {
                    page: page,
                    limit: _limit,
                    pages: totalPages,
                    total: totalItems,
                },
                data: res,
            };
        } else {
            throw new InternalServerErrorException();
        }
    }

    async findOne(id: string) {
        const _select = ['_id', 'name', 'apiPath', 'method', 'module'];
        const _populate = [];
        const res = await this.permissionModel.findById(id).select(_select).populate(_populate).exec();
        if (res) {
            return { data: res };
        } else {
            throw new InternalServerErrorException();
        }
    }

    async update(_id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
        const checkGod = await this.permissionModel.findById(_id);
        if (checkGod && checkGod.name === 'All') throw new BadRequestException("This permission can't be changed");
        const res = await this.permissionModel.findOneAndUpdate(
            { _id },
            {
                ...updatePermissionDto,
                updatedBy: user._id,
            },
            {
                new: true,
            },
        );
        if (res) {
            return { data: 'Updated' };
        } else {
            throw new NotFoundException(`Permission with ID ${_id} not found.`);
        }
    }

    async remove(_id: string, user: IUser) {
        const checkGod = await this.permissionModel.findById(_id);
        if (checkGod && checkGod.name === 'All') throw new BadRequestException("This permission can't be changed");
        const res = await this.permissionModel.findOneAndUpdate(
            { _id },
            {
                isDeleted: true,
                deletedBy: user._id,
                deletedAt: new Date(),
            },
            {
                new: true,
            },
        );
        if (res) {
            return { data: 'Deleted' };
        } else {
            throw new NotFoundException(`Permission with ID ${_id} not found.`);
        }
    }

    async restore(_id: string) {
        const res = await this.permissionModel.findOneAndUpdate(
            { _id },
            {
                isDeleted: false,
            },
            {
                new: true,
            },
        );
        if (res) {
            return { data: 'Restored' };
        } else {
            throw new NotFoundException(`Permission with ID ${_id} not found.`);
        }
    }
}
