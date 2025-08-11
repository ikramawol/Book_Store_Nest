import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateReviewDto, UpdateReviewDto } from './dto'


@Injectable({})
export class ReviewService  {
    constructor(private readonly prisma: PrismaService){}

    async createReview(dto: CreateReviewDto, userId: number) {
        
        return await this.prisma.review.create({
            data: {
                ...dto,
                userId
            }
        }
    );
    }

    async getReviewByBook(bookId: number) {
        
        return await this.prisma.review.findMany({
            where: { bookId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
            
        });
    }
    

    async getReviewById(id: number) {
        return await this.prisma.review.findUnique({
            where: { id },
        });
    }
    
    async updateReview(id: number, data: UpdateReviewDto) {
        return await this.prisma.review.update({
            where: { id },
            data,
        });
    }

    async deleteReview(id: number) {
        return await this.prisma.review.delete({
            where: { id }
        });
    }
}