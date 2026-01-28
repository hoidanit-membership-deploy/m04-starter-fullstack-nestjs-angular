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

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto, UpdateTodoDto, PaginationDto } from './dto';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
  ) {}

  async findAll(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Todo>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.todosRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number, userId: string): Promise<Todo> {
    const todo = await this.todosRepository.findOne({
      where: { id, userId },
    });

    if (!todo) {
      throw new NotFoundException(`Todo với ID ${id} không tìm thấy`);
    }

    return todo;
  }

  async create(createTodoDto: CreateTodoDto, userId: string): Promise<Todo> {
    const todo = this.todosRepository.create({
      ...createTodoDto,
      userId,
    });

    return this.todosRepository.save(todo);
  }

  async update(
    id: number,
    updateTodoDto: UpdateTodoDto,
    userId: string,
  ): Promise<Todo> {
    const todo = await this.findOne(id, userId);

    Object.assign(todo, updateTodoDto);

    return this.todosRepository.save(todo);
  }

  async remove(id: number, userId: string): Promise<void> {
    const todo = await this.findOne(id, userId);
    await this.todosRepository.remove(todo);
  }
}
