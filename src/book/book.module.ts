import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    imports: [PrismaModule],
    controllers: [BookController],
    providers: [BookService, PrismaService],
})
export class BookModule {}
