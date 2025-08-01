import { Module } from '@nestjs/common';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './auth/common/guards/at.guard';
import { RolesGuard } from './auth/common/guards/roles.guard';

@Module({
    imports: [BookModule, UserModule, AuthModule, PrismaModule],
    providers: [
        PrismaService,
        {
            provide: APP_GUARD,
            useClass: AtGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        }
    ]
})
export class AppModule {}

// This is the main application module for a NestJS application.
// It imports the necessary modules and sets up the application structure.