import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { HashPassword } from 'src/utils/hash.password';
import { RolesModule } from 'src/roles/roles.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), RolesModule],
    controllers: [UsersController],
    providers: [UsersService, HashPassword],
    exports: [UsersService],
})
export class UsersModule {}
