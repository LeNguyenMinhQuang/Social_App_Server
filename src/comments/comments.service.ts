import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from 'src/datatype/datatype';
import aqp from 'api-query-params';
import { Comment } from './schemas/comment.schemas';

@Injectable()
export class CommentsService {
    constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) {}

    async create(createCommentDto: CreateCommentDto, user: IUser) {
        const res = await this.commentModel.create({
            ...createCommentDto,
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
        const _limit = 10;
        const _sort = sort ? sort : '-createdAt';
        const _skip = (page - 1) * _limit;
        const _select = ['-createBy', '-updatedBy', '-deletedBy', '-isDeleted', '-deletedAt', '-__v'];
        const _populate = [{ path: 'userId', select: ['_id', 'userName', 'role', 'gender', 'avatar'] }];

        const totalItems = (await this.commentModel.find(_filter).exec()).length;
        const totalPages = Math.ceil(totalItems / _limit);

        const res = await this.commentModel
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
        const _populate = [{ path: 'userId', select: ['_id', 'userName', 'role', 'gender', 'avatar'] }];
        const res = await this.commentModel.findById(id).select(_select).populate(_populate).exec();
        if (res) {
            return { data: res };
        } else {
            throw new InternalServerErrorException();
        }
    }

    async update(_id: string, updateCommentDto: UpdateCommentDto, user: IUser) {
        const res = await this.commentModel.findOneAndUpdate(
            { _id },
            {
                ...updateCommentDto,
                updatedBy: user._id,
            },
            {
                new: true,
            },
        );
        if (res) {
            return { data: 'Updated' };
        } else {
            throw new NotFoundException(`Comment with ID ${_id} not found.`);
        }
    }

    async remove(_id: string, user: IUser) {
        const res = await this.commentModel.findOneAndUpdate(
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
        const res = await this.commentModel.findOneAndUpdate(
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

    async likeComment(_id: string, user: IUser) {
        const res = await this.commentModel.findOneAndUpdate(
            { _id },
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
            {
                new: true,
            },
        );

        if (res) {
            return { data: 'Liked/Unliked' };
        } else {
            throw new NotFoundException(`Comment with ID ${_id} not found.`);
        }
    }
}
