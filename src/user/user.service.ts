import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Role } from ".prisma/client/default";

@Injectable({})
export class UserService{
    constructor(private prismaService: PrismaService){}

    async getAllUsers(){
        return await this.prismaService.user.findMany();
    }

    async getUserById(id: number){
        const user = await this.prismaService.user.findUnique({
            where: { id }
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async updateUser(id: number, data: any){
        const user = await this.prismaService.user.findUnique({
            where: { id }
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return await this.prismaService.user.update({
            where: { id }, 
            data 
        });
    }
    
    async changeRole(id: number, role: Role){
        const user = await this.prismaService.user.findUnique({
            where: { id }
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return await this.prismaService.user.update({
            where: { id },
            data: { role }
        });
    }
}