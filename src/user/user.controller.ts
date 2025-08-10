import { Controller, Put, HttpStatus, HttpCode, Get, Patch, ParseIntPipe, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/auth/common/decorators/index';
import { Role } from '@prisma/client';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { Public } from 'src/auth/common/decorators/index';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Public()
    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllUsers(){
        return await this.userService.getAllUsers();
    }
    
    @Public()
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getUserById(@Param('id', ParseIntPipe) id: number){
        return await this.userService.getUserById(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() data: any){
        return await this.userService.updateUser(id, data);
    }

    @Patch(':id/role')
    @Roles('ADMIN')
    @HttpCode(HttpStatus.OK)
    async changeRole (
        @Param('id', ParseIntPipe) id: number,
        @Body('role') role:Role
    ){
        return await this.userService.changeRole(id, role);
    }

}
