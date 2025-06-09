import { Module } from '@nestjs/common';
import { FollowRequestsService } from './follow-requests.service';
import { FollowRequestsController } from './follow-requests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowRequest, FollowRequestSchema } from './schemas/follow-requests.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: FollowRequest.name, schema: FollowRequestSchema }]), UsersModule],
    controllers: [FollowRequestsController],
    providers: [FollowRequestsService],
})
export class FollowRequestsModule {}
