import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { FollowRequestsService } from './follow-requests.service';
import { Message, User } from 'src/decorator/customize';
import { IUser } from 'src/datatype/datatype';

@Controller('follow-requests')
export class FollowRequestsController {
    constructor(private readonly followRequestsService: FollowRequestsService) {}

    @Message('Create Request')
    @Post(':receiverId')
    create(@Param('receiverId') receiverId: string, @User() user: IUser) {
        return this.followRequestsService.sendRequest(receiverId, user);
    }

    @Message('Accept Request')
    @Patch(':requestId/accept')
    accept(@Param('requestId') requestId: string) {
        return this.followRequestsService.accepted(requestId);
    }
}
