import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Permission, PermissionSchema } from 'src/permissions/schemas/permission.schemas';
import { Role, RoleSchema } from 'src/roles/schemas/role.schemas';
import { HashPassword } from 'src/utils/hash.password';
import { ConfigService } from '@nestjs/config';
import { DatabasesController } from './databases.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Permission.name, schema: PermissionSchema },
            { name: Role.name, schema: RoleSchema },
        ]),
    ],
    controllers: [DatabasesController],
    providers: [DatabasesService, HashPassword, ConfigService],
})
export class DatabasesModule {}
