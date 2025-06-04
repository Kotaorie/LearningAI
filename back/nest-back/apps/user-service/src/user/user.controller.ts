import { Controller, Delete, Get, Patch, Post, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':email')
    async getUserByEmail(@Param('string')email: string): Promise<any> {
        return this.userService.findByEmail(email);
    }

    @Post()
    async createUser(@Body() data: any): Promise<any> {
        return this.userService.create(data);
    }

    @Patch(':id')
    async updateUser(
        @Param('id') id: number,
        @Body() data: any,
    ): Promise<any> {
        return this.userService.update(id, data);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: number): Promise<any> {
        return this.userService.delete(id);
    }


}
