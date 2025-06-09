import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from 'src/roles/schemas/role.schemas';
// import { Role } from 'src/roles/schemas/role.schemas';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    // Auth
    @Prop({ required: true, unique: true, index: true })
    userName: string;

    @Prop({ required: true, unique: true, index: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: Types.ObjectId, ref: 'Role' })
    role: Types.ObjectId;

    @Prop({ default: null })
    refreshToken: string;

    // Detail

    @Prop({ default: null })
    fullName: string;

    @Prop({ default: null })
    phone: string;

    @Prop({ default: null })
    dateOfBirth: Date;

    @Prop({ default: null })
    address: string;

    @Prop({ default: null })
    bio: string;

    @Prop({ enum: ['male', 'female', 'cat', 'dog'], default: 'dog' })
    gender: string;

    @Prop({ default: null })
    avatar: string;

    // Account

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: false })
    isPrivate: boolean;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    following: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    follower: Types.ObjectId[];

    @Prop({ default: 0 })
    followingCount: number;

    @Prop({ default: 0 })
    followedCount: number;

    // Other Info

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

export const UserSchema = SchemaFactory.createForClass(User);
