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

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Hello World với Nestjs!',
      author: 'Hỏi Dân IT - @hoidanit',
      website: "https://hoidanit.vn",
      endpoints: [
        { method: 'GET', path: '/', description: 'API information' },
        { method: 'GET', path: '/health', description: 'Health check' },
        { method: 'GET', path: '/todos', description: 'Get all todos' },
        { method: 'GET', path: '/todos/:id', description: 'Get todo by ID' },
        { method: 'POST', path: '/todos', description: 'Create a new todo' },
        { method: 'PUT', path: '/todos/:id', description: 'Update a todo' },
        { method: 'DELETE', path: '/todos/:id', description: 'Delete a todo' },
      ],
    };
  }
}
