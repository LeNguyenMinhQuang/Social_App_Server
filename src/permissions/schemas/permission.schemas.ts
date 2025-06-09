import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema({ timestamps: true })
export class Permission {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    apiPath: string;

    @Prop({ required: true })
    method: string;

    @Prop({ required: true })
    module: string;

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

export const PermissionSchema = SchemaFactory.createForClass(Permission);
