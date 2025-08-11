import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Roles } from '../auth/common/decorators/roles.decorator';
import { Public } from 'src/auth/common/decorators/index';
import { PaginationDto } from './dto/pagination.dto';

@Controller('book')
export class BookController {
  // bookService: BookController;
  // constructor(bookService : BookController){
  //     this.bookService = bookService
  // }
  //just adding private is an alternative

  constructor(private readonly bookService: BookService) {}

  @Roles('ADMIN', 'MEMBER')
  @Post()
  async createBook(@Body() dto: CreateBookDto) {

    try{

      const existingBook = await this.bookService.findByTitle(dto.title);
      if (existingBook){
        throw new Error('Book with this title already exists');
      }
    } catch (error) {
      throw new Error('Error creating book');
    }
    return await this.bookService.createBook(dto);
  }

  @Public()
  @Get()
  async getBooks(@Query() paginationDto: PaginationDto) {
    return await this.bookService.getBooks(paginationDto);
  }

  @Public()
  @Get('search')
  async searchBookAndFilter(
    @Query('q') search?: string,
    @Query('category') category?: string,
  ) {
    return await this.bookService.searchBookAndFilter(search, category);
  }

  @Public()
  @Get(':id')
  async getBookById(@Param('id', ParseIntPipe) id: number) {
    try{
      if (!id) throw Error ('Book ID is required');
      const book = await this.bookService.getBookById(id);
      if (!book) throw Error ('Book not found');

    } catch(error){
      throw new Error('Error fetching book');
    }
    return await this.bookService.getBookById(id);
  }

  @Roles('ADMIN', 'MEMBER')
  @Put(':id')
  async updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookDto,
  ) {

    const book = await this.bookService.getBookById(id);
    if (!book) throw new Error('Book not found');

    return await this.bookService.updateBook(id, dto);
  }

  @Roles('ADMIN', 'MEMBER')
  @Delete(':id')
  async deleteBook(@Param('id', ParseIntPipe) id: number) {
    const book = await this.bookService.getBookById(id);
    if (!book) throw new Error('Book not found');

    return {
      message: 'Book deleted successfully',
      book: await this.bookService.deleteBook(id),
    };
  }
}
