import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IUser } from 'src/datatype/datatype';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class PostService {
    constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

    async create(createPostDto: CreatePostDto, user: IUser) {
        const res = await this.postModel.create({
            ...createPostDto,
            userId: user._id,
            createdBy: user._id,
        });
        if (res) {
            return {
                data: {
                    _id: res._id,
                },
            };
        } else {
            throw new InternalServerErrorException();
        }
    }

    async findAll(qs: string, page: number) {
        const { filter, sort } = aqp(qs);
        delete filter.page;
        const _filter = { ...filter, isDeleted: false };
        const _limit = 5;
        const _sort = sort ? sort : '-createdAt';
        const _skip = (page - 1) * _limit;
        const _select = ['-createBy', '-updatedBy', '-deletedBy', '-isDeleted', '-deletedAt', '-__v'];
        const _populate = [
            {
                path: 'userId',
                select: ['_id', 'userName', 'role', 'gender', 'avatar'],
                populate: { path: 'role', select: ['name'] },
            },
            { path: 'mentions', select: ['_id', 'userName', 'role', 'gender', 'avatar'] },
        ];

        const totalItems = (await this.postModel.find(_filter).exec()).length;
        const totalPages = Math.ceil(totalItems / _limit);

        const res = await this.postModel
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
        const _select = ['-createBy', '-updatedBy', '-deletedBy', '-isDeleted', '-deletedAt', '-__v'];
        const _populate = [
            { path: 'userId', select: ['_id', 'userName', 'role', 'gender', 'avatar'] },
            { path: 'mentions', select: ['_id', 'userName', 'role', 'gender', 'avatar'] },
        ];
        const res = await this.postModel.findById(id).select(_select).populate(_populate).exec();
        if (res) {
            return { data: res };
        } else {
            throw new InternalServerErrorException();
        }
    }

    async update(_id: string, updatePostDto: UpdatePostDto, user: IUser) {
        const res = await this.postModel.findOneAndUpdate(
            { _id },
            {
                ...updatePostDto,
                updatedBy: user._id,
            },
            {
                new: true,
            },
        );
        if (res) {
            return { data: 'Updated' };
        } else {
            throw new NotFoundException(`Post with ID ${_id} not found.`);
        }
    }

    async remove(_id: string, user: IUser) {
        const res = await this.postModel.findOneAndUpdate(
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
            throw new NotFoundException(`Post with ID ${_id} not found.`);
        }
    }

    async restore(_id: string) {
        const res = await this.postModel.findOneAndUpdate(
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
            throw new NotFoundException(`Post with ID ${_id} not found.`);
        }
    }

    async likePost(_id: string, user: IUser) {
        const res = await this.postModel.findOneAndUpdate(
            { _id },
            [
                {
                    $set: {
                        likeBy: {
                            $cond: {
                                if: { $in: [user._id, '$likeBy'] },
                                then: { $setDifference: ['$likeBy', [user._id]] },
                                else: { $concatArrays: ['$likeBy', [user._id]] },
                            },
                        },
                        likesCount: {
                            $cond: {
                                if: { $in: [user._id, '$likeBy'] },
                                then: { $subtract: ['$likesCount', 1] },
                                else: { $add: ['$likesCount', 1] },
                            },
                        },
                    },
                },
            ],
            {
                new: true,
            },
        );

        if (res) {
            return { data: 'Liked/Unliked' };
        } else {
            throw new NotFoundException(`Post with ID ${_id} not found.`);
        }
    }
}
