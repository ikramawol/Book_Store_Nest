import { Controller, Put, HttpStatus, HttpCode, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllUsers(){
        return await this.userService.getAllUsers();
    }
    
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getUserById(id: number){
        return await this.userService.getUserById(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async updateUser(id: number, data: any){
        return await this.userService.updateUser(id, data);
    }

}
