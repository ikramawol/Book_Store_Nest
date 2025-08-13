import { CreateReviewDto, UpdateReviewDto } from "./dto";
import { ReviewService } from "./review.service";
import { BookService } from "../book/book.service";
import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, BadGatewayException } from '@nestjs/common'
import { Public, GetCurrentUserId } from 'src/auth/common/decorators/index';


@Controller('review')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService,
        private readonly bookService: BookService
    ){}

    @Post()
    async createReview(@Body() dto: CreateReviewDto, @GetCurrentUserId() userId: number){
        try{
            if (!userId) throw new Error('User ID is required');
            if (!dto.bookId) throw new Error('Book ID is required');

            const book = await this.bookService.getBookById(dto.bookId);
            if (!book) throw new BadGatewayException(`Book with ID ${dto.bookId} not found`);

            const existingReview = await this.reviewService.getReviewByBook(dto.bookId);
            if (existingReview) throw new BadGatewayException(`Review for book ${dto.bookId} already exists`);
        } catch(error) {
            throw new BadGatewayException('Error creating review');
        }
        return await this.reviewService.createReview(dto, userId);
    }

    @Public()
    @Get('book/:bookId')
    async GetReviewByBook(@Param('bookId', ParseIntPipe) bookId: number){

        try{
            if (!bookId) throw new Error('Book ID is required');

            const book = await this.bookService.getBookById(bookId);
            if (!book) throw new Error(`Book with ID ${bookId} not found`)

            const review = await this.reviewService.getReviewByBook(bookId);
            if (!review) throw new Error(`Review with ${bookId} not found`);
        } catch (error) {
            throw new Error('Error fetching review');
        }
        return await this.reviewService.getReviewByBook(bookId);
    }

    @Public()
    @Get(':id')
    async GetReviewById(@Param('id', ParseIntPipe) id: number){
        try{
            if (!id) throw new Error('Review ID is required');

            const review = await this.reviewService.getReviewById(id);
            if (!review) throw new Error(`Review with ${id} not found`);
            if (!review.userId) throw new Error('User ID is required');
        } catch (error) {
            throw new Error('Error fetching review');
        }
        return await this.reviewService.getReviewById(id);
    }

    @Put(':id')
    async updateReview(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateReviewDto){
            try{

                if (!id) throw new Error('Review ID is required');
                const review = await this.reviewService.getReviewById(id);
                if (!review) throw new Error(`Review with ${id} not found`);

            } catch(error){
                throw new Error('Error updating review');
            }
            return await this.reviewService.updateReview(id, dto);
        }
    
    @Delete(':id')
    async deleteReview(@Param('id', ParseIntPipe) id: number){

        try{

            if (!id) throw new Error('Review ID is required');
            const review = await this.reviewService.getReviewById(id);
            if (!review) throw new Error(`Review with ${id} not found`);

        } catch(error){
            throw new Error('Error deleting review');
        }
        return {
            message: `Review with ${id} id, deleted successfully`,
            data: await this.reviewService.deleteReview(id)
        };
    }

}