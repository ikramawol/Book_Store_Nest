import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto} from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('book')
export class BookController {
    // bookService: BookController;
    // constructor(bookService : BookController){
    //     this.bookService = bookService
    // }
    //just adding private is an alternative 

    constructor(private readonly bookService: BookService){}

    @Post()
    createBook(@Body() dto: CreateBookDto) {
        return this.bookService.createBook(dto);
    }

    @Get()
    getBooks() {
        return this.bookService.getBooks();
    }

    @Get(':id')
    getBookById(@Param('id', ParseIntPipe) id: number){
        return this.bookService.getBookById(id);
    }

    @Put(':id')
    updateBook(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateBookDto){
            return this.bookService.updateBook(id, dto);
        }
    
    @Delete(':id')
    deleteBook(@Param('id', ParseIntPipe)id: number){
        return {message:'Book deleted successfully', book: this.bookService.deleteBook(id)};
    }
}