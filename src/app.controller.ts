import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service.js';
import { TimeGuard } from './commen/guards/time.guard.js';
import { CreateUserDto } from './dto/CreateUserDto.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @UseGuards(TimeGuard)
  @Get('/office-only')
  officeOnly(@Req() request: Request & { currentHour: number }) {
    return {
      message: 'Office route',
      currentHour: request.currentHour,
    };
  }

  @Get('/users')
  getUsers() {
    return 'the users url path..';
  }

  @Get('/users/:id')
  getSingleUser(@Param('id') id: string) {
    return `User ID: ${id}`;
  }

  @Get('/users/:userId/:postId')
  getSingleUserPost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ) {
    return `User ID: ${userId}, Post ID: ${postId}`;
  }

  @Get('/user')
  getUserName(@Query('name') name: String, @Query('age') age: String) {
    return `seaching for ${name} with age ${age}`;
  }

  @Get('/users/:userId/posts/:postId')
  getUserPosts(
    @Param('userId') userId: String,
    @Param('postId') postId: String,
    @Query('status') status: String,
    @Query('likes') likes: String,
    @Query('comments') comments: String,
  ) {
    return `User ID: ${userId}, Post ID: ${postId}, Like: ${likes}, Comments: ${comments}, Status: ${status}`;
  }

  @Get('/products/:productId')
  getProduct(
    @Param('productId') productId: string,
    @Query('reviews') reviews: string,
  ) {
    return `Product: ${productId}, Reviews: ${reviews}`;
  }

  @Post('/users')
  createUser(@Body() body: CreateUserDto) {
    return `Name: ${body.name}, Email: ${body.email}, Age: ${body.age}`;
  }
}
