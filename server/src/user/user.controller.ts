import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDto } from './dtos/createUserDto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  loginUser(@Body() createUser: CreateUserDto) {
    console.log({ createUser });
    this.userService.loginUser(createUser);
    return true;
  }
}
