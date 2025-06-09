import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schemas';

export type FollowRequestDocument = HydratedDocument<FollowRequest>;

@Schema({ timestamps: true })
export class FollowRequest {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    sender: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    receiver: Types.ObjectId;

    @Prop({ enum: ['pending', 'accepted', 'denied'], default: 'pending' })
    status: string;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    updatedBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    deletedBy: Types.ObjectId;

    @Prop({ default: null })
    createdAt: Date;

    @Prop({ default: null })
    updatedAt: Date;

    @Prop({ default: false })
    isDeleted: Boolean;

    @Prop({ default: null })
    deletedAt: Date;
}

export const FollowRequestSchema = SchemaFactory.createForClass(FollowRequest);
