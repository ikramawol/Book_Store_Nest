import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationDto } from './dto/pagination.dto';

@Injectable({})
export class BookService{
    constructor(private readonly prisma: PrismaService){}
    
    async getBooks(paginationDto: PaginationDto){
        const { limit = 10, page = 1 } = paginationDto;

        const skip = (page - 1) * limit;
        return await this.prisma.book.findMany({
            skip,
            take: limit,
        });
    }

    async getBookById(id: number){
        try{
            if(!id) throw new Error('Book ID is required');

            const book = await this.prisma.book.findUnique({
                where: { id }
            });

            if (!book) throw new Error('Book not found');
        } catch (error) {
            throw new Error('Error fetching book');
        }
        return await this.prisma.book.findUnique({ 
            where: { id }
        });
    }
    
    async createBook(data: CreateBookDto){
        const { categoryNames, ...bookData } = data;
        return await this.prisma.book.create({
            data: {
                ...bookData,
                ...(categoryNames && categoryNames.length
                    ? {
                        category: {
                            connectOrCreate: categoryNames.map((name) => ({
                                where: { name },
                                create: { name },
                            })),
                        },
                    }
                    : {}),
            },
            include: { category: true },
        });
    }
    
    async updateBook(id: number, dto: UpdateBookDto){
        
        const { categoryNames, ...bookData } = dto;
        const book = await this.prisma.book.findUnique({
            where:{ id }
        })
        if (!book) throw new Error('Book not found');

        
        return await this.prisma.book.update({
            where: { id },
            data: {
                ...bookData,
                ...(categoryNames && categoryNames.length
                    ? {
                        category: {
                            connectOrCreate: categoryNames.map((name) => ({
                                where: { name },
                                create: { name },
                            })),
                        },
                    }
                    : {}),
            },
            include: { category: true },

        });
    }

    async deleteBook(id: number){
        try{
            if (!id) throw new Error('Book ID is required for deletion');

            const book = await this.prisma.book.findUnique({
                where:{ id }
            })
            if (!book) throw new Error('Book not found');
        } catch (error) {
            throw new Error('Error deleting book');
        }
        return await this.prisma.book.delete({
            where: { id }
        });
    }

    async searchBookAndFilter(search?: string , category?: string) {
        return await this.prisma.book.findMany({
            where: {
                AND: [
                    search
                    ? {
                        OR:[
                            {title: { contains: search, mode: 'insensitive' }},
                            {author: { contains: search, mode: 'insensitive' }},
                            {description: { contains: search, mode: 'insensitive' }},
                        ],
                    }
                    : {},
                    category
                    ? { category:
                        { some:
                            { name: { contains: category, mode: 'insensitive' } }
                        }
                    }
                    : {},
                ],
            },
        });
    }

    async findByTitle(title: string) {
        return await this.prisma.book.findFirst({ where: { title } });
    }
}