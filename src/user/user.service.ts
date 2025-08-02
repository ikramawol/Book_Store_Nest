import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable({})
export class UserService{
    constructor(private prismaService: PrismaService){}

    async getAllUsers(){
        return await this.prismaService.user.findMany();
    }

    async getUserById(id: number){
        return await this.prismaService.user.findUnique({ where: { id }});
    }

    async updateUser(id: number, data: any){
        return await this.prismaService.user.update({ where: { id }, data });
    }
    
    async changeRole(id: string, role: string){
        return await this.prismaService.user.update()
    }
}