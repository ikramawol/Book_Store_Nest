import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable({})
export class BookService{
    constructor(private readonly prisma: PrismaService){}
    
    async getBooks(){
        return await this.prisma.book.findMany();
    }

    async getBookById(id: number){
        return await this.prisma.book.findUnique({ 
            where: { id }
        });
    }
    
    async createBook( data: CreateBookDto){
        return await this.prisma.book.create({
            data 
        });

    }

    async updateBook(id: number, data: UpdateBookDto){
        return await this.prisma.book.update({
            where: { id },
            data,
        });
    }

    async deleteBook(id: number){
        return await this.prisma.book.delete({ 
            where: { id }
        });
    }
}