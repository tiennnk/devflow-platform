import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });

    return user;
  }

  async createUser(username: string, email: string, hashedPassword: string): Promise<User> {
    const newUser = this.userRepository.create({ username, email, password: hashedPassword });

    return this.userRepository.save(newUser);
  }
}
