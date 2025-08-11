import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ReviewService } from './review.service'
import { PrismaModule } from '../prisma/prisma.module';
import { ReviewController } from '../review/review.controller'
import { BookService } from 'src/book/book.service';

@Module({
    imports: [PrismaModule],
    controllers: [ ReviewController],
    providers: [BookService, ReviewService, PrismaService],
    exports: [BookService, ReviewService]
})
export class ReviewModule{}

