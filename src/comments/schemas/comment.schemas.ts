import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Post' })
    postId: Types.ObjectId;

    @Prop({ default: null })
    content: string;

    @Prop({ default: [] })
    image: string;

    @Prop({ default: null })
    location: string;

    @Prop([{ type: Types.ObjectId, ref: 'User' }])
    likeBy: Types.ObjectId[];

    @Prop({ default: 0 })
    likesCount: number;

    // Other Info
    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    updatedBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    deletedBy: Types.ObjectId;

    // @Prop({ default: null })
    // createdAt: Date;

    // @Prop({ default: null })
    // updatedAt: Date;

    @Prop({ default: false })
    isDeleted: Boolean;

    @Prop({ default: null })
    deletedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
