import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto} from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Roles } from '../auth/common/decorators/roles.decorator';

@Controller('book')
export class BookController {
    // bookService: BookController;
    // constructor(bookService : BookController){
    //     this.bookService = bookService
    // }
    //just adding private is an alternative 

    constructor(private readonly bookService: BookService){}
    
    @Roles('ADMIN', 'MEMBER')
    @Post()
    async createBook(@Body() dto: CreateBookDto) {
        return await this.bookService.createBook(dto);
    }

    @Get()
    async getBooks() {
        return await this.bookService.getBooks();
    }

    @Get(':id')
    async getBookById(@Param('id', ParseIntPipe) id: number){
        return await this.bookService.getBookById(id);
    }

    @Roles('ADMIN')
    @Put(':id')
    async updateBook(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateBookDto){
            return await this.bookService.updateBook(id, dto);
        }
    
    
    @Roles('ADMIN')
    @Delete(':id')
    async deleteBook(@Param('id', ParseIntPipe)id: number){
        return {message:'Book deleted successfully', book: await this.bookService.deleteBook(id)};
    }
}