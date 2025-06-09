import { HashPassword } from './../utils/hash.password';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { RolesService } from 'src/roles/roles.service';
import { IUser } from 'src/datatype/datatype';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private hashPassword: HashPassword,
        private rolesService: RolesService,
    ) {}

    // For Client

    async create(userDto: CreateUserDto, executor: IUser) {
        const { userName, email, password, role } = userDto;
        const existUser = await this.userModel.findOne({ $or: [{ email }, { userName }] }).exec();
        if (existUser) throw new BadRequestException(`Email: ${email} or Username: ${userName} is already exist`);

        const hashPassword = this.hashPassword.handleHashPassword(password);
        const _role = await this.rolesService.findOneByName(role);
        if (!_role || role === 'SUPER_ADMIN') throw new BadRequestException(`Role: ${role} is not exist`);
        let user = await this.userModel.create({
            ...userDto,
            password: hashPassword,
            role: _role._id,
            createdBy: executor._id,
        });
        if (user) {
            return {
                _id: user._id,
                createdAt: user.createdAt,
                createdBy: user.createdBy,
            };
        } else {
            throw new InternalServerErrorException();
        }

        return {
            _id: user._id,
            createdAt: user.createdAt,
            createdBy: user.createdBy,
        };
    }

    async findAll(qs: string, page: number) {
        const { filter, sort } = aqp(qs);
        delete filter.page;

        const _filter = { ...filter, isDeleted: false };
        const _limit = 5;
        const _sort = sort ? sort : '-createdAt';
        const _skip = (page - 1) * _limit;
        const _select = [
            '-password',
            '-isDeleted',
            '-createdAt',
            '-createdBy',
            '-updatedAt',
            '-updatedBy',
            '-deletedAt',
            '-deletedBy',
            '-refreshToken',
            '-__v',
        ];
        const _populate = [{ path: 'role', select: ['_id', 'name'] }];

        const totalItems = (await this.userModel.find(_filter).exec()).length;
        const totalPages = Math.ceil(totalItems / _limit);

        const res = await this.userModel
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
        const _select = [
            '-password',
            '-isDeleted',
            '-createdAt',
            '-createdBy',
            '-updatedAt',
            '-updatedBy',
            '-deletedAt',
            '-deletedBy',
            '-refreshToken',
            '-__v',
        ];
        const _populate = { path: 'role', select: ['id', 'name'] };
        const res = await this.userModel.findById(id).select(_select).populate(_populate).exec();
        if (res) {
            return { data: res };
        } else {
            throw new InternalServerErrorException();
        }
    }

    async update(_id: string, updateUserDto: UpdateUserDto, user: IUser) {
        const { role } = updateUserDto;
        if (role) {
            const _role = await this.rolesService.findOneByName(role);
            if (!_role || role === 'SUPER_ADMIN') throw new BadRequestException(`Role: ${role} is not exist`);
        }
        const res = await this.userModel.findOneAndUpdate(
            { _id },
            {
                ...updateUserDto,
                updatedBy: user._id,
            },
            {
                new: true,
            },
        );
        if (res) {
            return { data: 'Updated' };
        } else {
            throw new NotFoundException(`User with ID ${_id} not found.`);
        }
    }

    async remove(_id: string, user: IUser) {
        const res = await this.userModel.findOneAndUpdate(
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
            throw new NotFoundException(`Comment with ID ${_id} not found.`);
        }
    }

    async restore(_id: string) {
        const res = await this.userModel.findOneAndUpdate(
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
            throw new NotFoundException(`Comment with ID ${_id} not found.`);
        }
    }

    async register(registerUserDto: RegisterUserDto) {
        const { userName, email, password } = registerUserDto;
        const isExistsUserName = await this.userModel.findOne({ userName });
        const isExistsEmail = await this.userModel.findOne({ email });
        if (isExistsUserName) throw new BadRequestException(`Username: ${userName} is already exists`);
        if (isExistsEmail) throw new BadRequestException(`Email: ${email} is already exists`);

        const _hashPassword = this.hashPassword.handleHashPassword(password);
        const _role = await this.rolesService.findOneByName('USER');
        const res = await this.userModel.create({
            ...registerUserDto,
            password: _hashPassword,
            role: _role?._id,
        });
        if (res) {
            return {
                data: { _id: res._id, userName: res.userName, email: res.email },
            };
        } else {
            throw new InternalServerErrorException();
        }
    }

    async unfollow(receiverId: string, user: IUser) {
        const senderId = user._id;
        const updateReceiver = await this.userModel.findOneAndUpdate(
            { _id: receiverId },
            {
                $inc: { followedCount: -1 },
                $pull: { follower: senderId },
            },
            { new: true },
        );
        if (!updateReceiver) throw new InternalServerErrorException();
        const updateSender = await this.userModel.findOneAndUpdate(
            {
                _id: senderId,
            },
            {
                $inc: { followingCount: -1 },
                $pull: { following: receiverId },
            },
            { new: true },
        );
        if (!updateSender) throw new InternalServerErrorException();
        return { data: 'Unfollowed' };
    }

    // For server

    async findOneByUserNameForValidate(userName: string) {
        const _populate = { path: 'role', select: ['_id', 'name', 'permission'] };
        const _select = ['_id', 'userName', 'email', 'role', 'password'];
        const user = await this.userModel.findOne({ userName }).select(_select).populate(_populate).exec();
        return user;
    }

    async updateUserToken(refresh_token: string | null, _id: string) {
        await this.userModel.updateOne({ _id }, { refreshToken: refresh_token });
    }

    async findUserByRefreshToken(refresh_token: string) {
        const _populate = { path: 'role', select: ['_id', 'name', 'permission'] };
        const _select = ['_id', 'userName', 'email', 'role'];
        const user = await this.userModel
            .findOne({ refreshToken: refresh_token })
            .select(_select)
            .populate(_populate)
            .exec();
        return user;
    }

    async updateFollow(sender: Types.ObjectId, receiver: Types.ObjectId) {
        const senderId = sender.toString();
        const receiverId = receiver.toString();
        const updateReceiver = await this.userModel.findOneAndUpdate(
            { _id: receiverId },
            {
                $inc: { followedCount: 1 },
                $addToSet: { follower: senderId },
            },
            { new: true },
        );
        if (!updateReceiver) throw new InternalServerErrorException();
        const updateSender = await this.userModel.findOneAndUpdate(
            {
                _id: senderId,
            },
            {
                $inc: { followingCount: 1 },
                $addToSet: { following: receiverId },
            },
            { new: true },
        );
        if (!updateSender) throw new InternalServerErrorException();
    }

    async findById(id: string) {
        const _select = [
            '-password',
            '-isDeleted',
            '-createdAt',
            '-createdBy',
            '-updatedAt',
            '-updatedBy',
            '-deletedAt',
            '-deletedBy',
            '-refreshToken',
            '-__v',
        ];
        const _populate = { path: 'role', select: ['id', 'name'] };
        const res = await this.userModel.findById(id).select(_select).populate(_populate).exec();
        if (res) {
            return res;
        } else {
            throw new InternalServerErrorException();
        }
    }
}
