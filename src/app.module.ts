import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AuthModule } from './auth/auth.module';
import { DatabasesModule } from './databases/databases.module';
import { PostModule } from './posts/post.module';
import { FilesModule } from './files/files.module';
import { CommentsModule } from './comments/comments.module';
import { FollowRequestsModule } from './follow-requests/follow-requests.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URL'),
                connectionFactory: (connection) => {
                    return connection;
                },
            }),
            inject: [ConfigService],
        }),
        ThrottlerModule.forRoot({
            throttlers: [{ ttl: 60, limit: 5 }],
        }),
        UsersModule,
        RolesModule,
        PermissionsModule,
        AuthModule,
        DatabasesModule,
        PostModule,
        FilesModule,
        CommentsModule,
        FollowRequestsModule,
    ],
    controllers: [AppController],
    providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
