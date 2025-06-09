import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schemas';
import { Role } from 'src/roles/schemas/role.schemas';
import { User } from 'src/users/schemas/user.schema';
import { GOD_PERMISSION, SUPER_ADMIN_ROLE, USER_ROLE } from './sample';
import { HashPassword } from 'src/utils/hash.password';

@Injectable()
export class DatabasesService implements OnModuleInit {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Role.name) private roleModel: Model<Role>,
        @InjectModel(Permission.name) private permissionModel: Model<Permission>,
        private config: ConfigService,
        private hashPassword: HashPassword,
    ) {}
    private readonly logger = new Logger(DatabasesService.name);

    async onModuleInit() {
        const isInit = this.config.get<string>('SHOULD_INIT');
        if (Boolean(isInit)) {
            const countUser = await this.userModel.countDocuments();
            const countPermission = await this.permissionModel.countDocuments();
            const countRole = await this.roleModel.countDocuments({});

            // Init permission
            if (countPermission === 0) {
                this.logger.log('INIT_PERMISSION');
                await this.permissionModel.insertMany(GOD_PERMISSION);
            }

            // Init role
            if (countRole === 0) {
                this.logger.log('INIT_ROLE');
                const temp = await this.permissionModel.find({}).select('_id');
                const permissions = temp.map((item) => item._id);
                await this.roleModel.insertMany([
                    {
                        name: SUPER_ADMIN_ROLE,
                        description: 'tối thượng đẹp trai',
                        isActive: true,
                        permission: permissions,
                    },
                    {
                        name: USER_ROLE,
                        description: 'kfc xấu trai',
                        isActive: true,
                        permission: [],
                    },
                ]);
            }

            // Init user
            if (countUser === 0) {
                const adminRole = await this.roleModel.findOne({ name: SUPER_ADMIN_ROLE }).select('_id');
                const userRole = await this.roleModel.findOne({ name: USER_ROLE }).select('_id');

                await this.userModel.insertMany([
                    {
                        userName: 'Admin',
                        email: 'admin@test.com',
                        password: this.hashPassword.handleHashPassword(this.config.get<string>('INIT_PASSWORD')!),
                        role: adminRole,
                    },
                    {
                        userName: 'User',
                        email: 'user@test.com',
                        password: this.hashPassword.handleHashPassword(this.config.get<string>('INIT_PASSWORD')!),
                        role: userRole,
                    },
                ]);
            }

            if (countUser > 0 && countPermission > 0 && countRole > 0) {
                this.logger.log('>>>>>>>>>>>>>>>>>>>CHICKEN<<<<<<<<<<<<<<<<<<<');
            }
        }
    }
}
