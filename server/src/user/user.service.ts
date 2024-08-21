import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUserDto';

@Injectable()
export class UserService {
  constructor() {}

  async loginUser(user: CreateUserDto) {
    console.log(user);
  }
}
