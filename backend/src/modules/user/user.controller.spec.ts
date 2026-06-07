jest.mock('./user.service', () => ({
  UserService: class {},
}));

jest.mock('../auth/guards/jwt-auth.guard', () => ({
  JwtAuthGuard: class {
    canActivate = jest.fn(() => true);
  },
}));

jest.mock('../auth/guards/roles.guard', () => ({
  RolesGuard: class {
    canActivate = jest.fn(() => true);
  },
}));

import { Test, TestingModule } from '@nestjs/testing';
import { UserRole, USER_API_MESSAGES } from './utils';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUser = {
    id: 'user-1',
    email: 'alice@example.com',
    name: 'Alice',
    role: UserRole.User,
    emailVerified: true,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserList = [
    mockUser,
    {
      id: 'user-2',
      email: 'bob@example.com',
      name: 'Bob',
      role: UserRole.Admin,
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockUserService = {
    findAll: jest.fn().mockResolvedValue({
      data: mockUserList,
      message: USER_API_MESSAGES.getAll,
    }),
    findById: jest.fn().mockResolvedValue({
      data: mockUser,
      message: USER_API_MESSAGES.getOne,
    }),
    create: jest.fn().mockResolvedValue({
      data: { ...mockUser, id: 'user-4', email: 'dave@example.com', name: 'Dave' },
      message: USER_API_MESSAGES.create,
    }),
    replace: jest.fn().mockResolvedValue({
      data: { ...mockUser, email: 'alice@new.com', name: 'Alice New' },
      message: USER_API_MESSAGES.replace,
    }),
    update: jest.fn().mockResolvedValue({
      data: { ...mockUser, name: 'Alice Updated' },
      message: USER_API_MESSAGES.update,
    }),
    remove: jest.fn().mockResolvedValue({
      data: null,
      message: USER_API_MESSAGES.delete,
    }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    userController = app.get<UserController>(UserController);
    userService = app.get<UserService>(UserService);
  });

  describe('getMe', () => {
    it('should return wrapped user for current JWT subject', async () => {
      const response = await userController.getMe({
        user: {
          sub: 'user-1',
          email: 'alice@example.com',
          name: 'Alice',
          role: UserRole.User,
        },
      } as Parameters<UserController['getMe']>[0]);
      expect(response).toEqual({
        data: mockUser,
        message: USER_API_MESSAGES.getOne,
      });
      expect(userService.findById).toHaveBeenCalledWith('user-1');
    });
  });

  describe('findAll', () => {
    it('should return wrapped user list', async () => {
      const response = await userController.findAll();
      expect(response).toEqual({
        data: mockUserList,
        message: USER_API_MESSAGES.getAll,
      });
      expect(userService.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return wrapped user', async () => {
      const response = await userController.findById('user-1');
      expect(response).toEqual({
        data: mockUser,
        message: USER_API_MESSAGES.getOne,
      });
      expect(userService.findById).toHaveBeenCalledWith('user-1');
    });
  });

  describe('create', () => {
    it('should return wrapped created user', async () => {
      const dto = {
        email: 'dave@example.com',
        name: 'Dave',
        password: 'Dave123!',
      };
      const response = await userController.create(dto);
      expect(response.data.email).toBe('dave@example.com');
      expect(response.message).toBe(USER_API_MESSAGES.create);
      expect(userService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('replace', () => {
    it('should replace a user', async () => {
      const dto = { email: 'alice@new.com', name: 'Alice New' };
      const response = await userController.replace('user-1', dto);
      expect(response.data.email).toBe('alice@new.com');
      expect(userService.replace).toHaveBeenCalledWith('user-1', dto);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto = { name: 'Alice Updated' };
      const response = await userController.update('user-1', dto);
      expect(response.data.name).toBe('Alice Updated');
      expect(userService.update).toHaveBeenCalledWith('user-1', dto);
    });
  });

  describe('remove', () => {
    it('should return wrapped delete confirmation', async () => {
      const response = await userController.remove('user-1');
      expect(response).toEqual({
        data: null,
        message: USER_API_MESSAGES.delete,
      });
      expect(userService.remove).toHaveBeenCalledWith('user-1');
    });
  });
});
