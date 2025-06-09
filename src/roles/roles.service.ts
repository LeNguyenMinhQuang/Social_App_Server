import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/datatype/datatype';
import { Role } from './schemas/role.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

    // For client

    async create(createRoleDto: CreateRoleDto, user: IUser) {
        const isExists = await this.roleModel.findOne({
            name: createRoleDto.name,
        });
        if (isExists) throw new BadRequestException(`Role: ${createRoleDto.name} is already exists`);

        const res = await this.roleModel.create({ ...createRoleDto, isActive: true, createdBy: user?._id });
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
        const _select = ['_id', 'name', 'description', 'isActive', 'permission', 'createdBy'];
        const _populate = [
            { path: 'permission', select: ['_id', 'apiPath', 'name', 'method'] },
            { path: 'createdBy', select: ['userName'] },
        ];

        const totalItems = (await this.roleModel.find(_filter).exec()).length;
        const totalPages = Math.ceil(totalItems / _limit);

        const res = await this.roleModel
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

    async update(_id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
        const res = await this.roleModel.findOneAndUpdate(
            { _id },
            {
                ...updateRoleDto,
                updatedBy: user._id,
            },
            {
                new: true,
            },
        );
        if (res) {
            return { data: 'Updated' };
        } else {
            throw new NotFoundException(`Role with ID ${_id} not found.`);
        }
    }

    async remove(_id: string, user: IUser) {
        const res = await this.roleModel.findOneAndUpdate(
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
            throw new NotFoundException(`Role with ID ${_id} not found.`);
        }
    }

    async restore(_id: string) {
        const res = await this.roleModel.findOneAndUpdate(
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
            throw new NotFoundException(`Role with ID ${_id} not found.`);
        }
    }

    // For server
    async findOne(id: string) {
        const _select = ['_id', 'name', 'description', 'isActive', 'permission', 'createdBy'];
        const _populate = [
            { path: 'permission', select: ['_id', 'apiPath', 'name', 'method'] },
            { path: 'createdBy', select: ['userName'] },
        ];
        const res = await this.roleModel.findById(id).select(_select).populate(_populate).exec();
        return res;
    }

    async findOneByName(name: string) {
        const _select = ['_id', 'name', 'description', 'isActive', 'permission', 'createdBy'];
        const _populate = [
            { path: 'permission', select: ['_id', 'apiPath', 'name', 'method'] },
            { path: 'createdBy', select: ['userName'] },
        ];
        const res = await this.roleModel.findOne({ name }).select(_select).populate(_populate).exec();
        return res;
    }
}
