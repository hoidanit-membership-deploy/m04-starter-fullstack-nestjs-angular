/*
 * Author: Hỏi Dân IT - @hoidanit
 *
 * This source code is developed for the course
 * "Deploy Siêu Tốc".
 * It is intended for educational purposes only.
 * Unauthorized distribution, reproduction, or modification is strictly prohibited.
 *
 * Copyright (c) 2026 Hỏi Dân IT. All Rights Reserved.
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { TodosService, PaginatedResult } from './todos.service';
import { CreateTodoDto, UpdateTodoDto, PaginationDto } from './dto';
import { Todo } from './todo.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll(
    @CurrentUser() user: { id: string },
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Todo>> {
    return this.todosService.findAll(user.id, paginationDto);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: string },
  ): Promise<Todo> {
    return this.todosService.findOne(id, user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createTodoDto: CreateTodoDto,
    @CurrentUser() user: { id: string },
  ): Promise<Todo> {
    return this.todosService.create(createTodoDto, user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
    @CurrentUser() user: { id: string },
  ): Promise<Todo> {
    return this.todosService.update(id, updateTodoDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: string },
  ): Promise<void> {
    return this.todosService.remove(id, user.id);
  }
}
