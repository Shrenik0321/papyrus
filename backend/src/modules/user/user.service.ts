import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Response, ApiResponse } from '../../lib/utils';
import { auth } from '../../lib/auth/utils';
import { USER_API_MESSAGES } from './utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repo';

@Injectable()
export class UserService {
  private readonly userRepository: UserRepository;
  private toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async findAll(): Promise<Response<UserResponseDto[]>> {
    const userList = await this.userRepository.findAll();

    const responseData: UserResponseDto[] = userList.map((u) =>
      this.toResponseDto(u),
    );

    return ApiResponse(responseData, USER_API_MESSAGES.getAll);
  }

  async findById(id: string): Promise<Response<UserResponseDto>> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    const responseData: UserResponseDto = this.toResponseDto(user);
    return ApiResponse(responseData, USER_API_MESSAGES.getOne);
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Response<UserResponseDto>> {
    if (!createUserDto.password) {
      throw new BadRequestException(
        'password is required to create a user with credentials',
      );
    }

    const result = await auth.api.signUpEmail({
      body: {
        email: createUserDto.email,
        password: createUserDto.password,
        name: createUserDto.name,
      },
    });

    if (!result?.user) {
      throw new BadRequestException('Failed to create user');
    }

    const user = await this.userRepository.findById(result.user.id);

    if (!user) {
      throw new NotFoundException('User was created but not found');
    }

    const responseData: UserResponseDto = this.toResponseDto(user);

    return ApiResponse(responseData, USER_API_MESSAGES.create);
  }

  async replace(
    id: string,
    createUserDto: CreateUserDto,
  ): Promise<Response<UserResponseDto>> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    user.email = createUserDto.email;
    user.name = createUserDto.name;

    const saved = await this.userRepository.save(user);

    const responseData: UserResponseDto = this.toResponseDto(saved);

    return ApiResponse(responseData, USER_API_MESSAGES.replace);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Response<UserResponseDto>> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    Object.assign(user, updateUserDto);
    const saved = await this.userRepository.save(user);

    const responseData: UserResponseDto = this.toResponseDto(saved);

    return ApiResponse(responseData, USER_API_MESSAGES.update);
  }

  async remove(id: string): Promise<Response<null>> {
    const deleted = await this.userRepository.delete(id);

    if (!deleted) {
      throw new NotFoundException(`User #${id} not found`);
    }

    const responseData: null = null;

    return ApiResponse(responseData, USER_API_MESSAGES.delete);
  }
}
