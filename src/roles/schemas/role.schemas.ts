import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schemas';
import { User } from 'src/users/schemas/user.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: [Types.ObjectId], ref: 'Permission' })
    permission: Permission[];

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

export const RoleSchema = SchemaFactory.createForClass(Role);
