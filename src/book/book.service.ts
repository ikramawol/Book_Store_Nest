import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable({})
export class BookService{
    constructor(private readonly prisma: PrismaService){}
    
    getBooks(){
        return this.prisma.book.findMany();
    }

    getBookById(id: number){
        return this.prisma.book.findUnique({ where: { id }});
    }
    
    createBook( data: CreateBookDto){
        return this.prisma.book.create({ data });

    }

    updateBook(id: number, data: UpdateBookDto){
        return this.prisma.book.update({
            where: { id },
            data,
        });
    }

    deleteBook(id: number){
        return this.prisma.book.delete({ where: { id}});
    }
}