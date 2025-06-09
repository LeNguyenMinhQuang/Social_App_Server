import { UsersService } from 'src/users/users.service';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FollowRequest } from './schemas/follow-requests.schema';
import { Model } from 'mongoose';
import { IUser } from 'src/datatype/datatype';

@Injectable()
export class FollowRequestsService {
    constructor(
        @InjectModel(FollowRequest.name) private followModel: Model<FollowRequest>,
        private usersService: UsersService,
    ) {}
    async sendRequest(receiverId: string, user: IUser) {
        const isExist = await this.followModel.findOne({ sender: user._id, receiver: receiverId });
        if (isExist) {
            const res = await this.followModel.findOneAndDelete({ _id: isExist._id }, { new: true });
            if (res) {
                return {
                    data: 'Canceled',
                };
            } else {
                throw new InternalServerErrorException();
            }
        }
        const res = await this.followModel.create({
            sender: user._id,
            receiver: receiverId,
            status: 'pending',
        });

        if (res) {
            return {
                data: { _id: res._id },
            };
        } else {
            throw new InternalServerErrorException();
        }
    }

    async denied(requestId: string) {
        const res = await this.followModel.findOneAndDelete({ _id: requestId }, { new: true });
        if (res) {
            return { data: 'Denied' };
        } else {
            throw new NotFoundException(`Request with ID ${requestId} not found.`);
        }
    }

    async accepted(requestId: string) {
        const res = await this.followModel.findById(requestId);
        if (res) {
            const { sender, receiver } = res;
            await this.usersService.updateFollow(sender, receiver);
            await this.followModel.deleteOne({ _id: requestId });
            return { data: 'Completed' };
        } else {
            throw new NotFoundException(`Request with ID ${requestId} not found.`);
        }
    }
}
