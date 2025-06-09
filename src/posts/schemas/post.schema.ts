import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    userId: Types.ObjectId;

    @Prop({ default: null })
    content: string;

    @Prop({ enum: ['null', 'happy', 'sad', 'angry', 'horny'], default: 'null' })
    emotion: string;

    @Prop({ default: [] })
    images: string[];

    @Prop({ enum: ['public', 'onlyFans', 'onlyMe'], default: 'public' })
    isPublic: string;

    @Prop({ default: null })
    location: string;

    @Prop([{ type: Types.ObjectId, ref: 'User' }])
    mentions: Types.ObjectId[];

    @Prop([{ type: Types.ObjectId, ref: 'User' }])
    likeBy: Types.ObjectId[];

    @Prop({ default: 0 })
    likesCount: number;

    @Prop([{ type: Types.ObjectId, ref: 'Comment' }])
    comments: Types.ObjectId[];

    @Prop({ default: 0 })
    commentsCount: number;

    @Prop({ default: 0 })
    sharesCount: number;

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

export const PostSchema = SchemaFactory.createForClass(Post);
