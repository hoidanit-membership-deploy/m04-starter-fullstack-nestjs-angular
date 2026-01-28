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

import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedTodos {
  data: Todo[];
  meta: PaginationMeta;
}

export interface CreateTodoDto {
  title: string;
  description?: string;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  completed?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly API_URL = environment.apiUrl;

  private todosSignal = signal<Todo[]>([]);
  private metaSignal = signal<PaginationMeta | null>(null);
  private loadingSignal = signal(false);

  readonly todos = this.todosSignal.asReadonly();
  readonly meta = this.metaSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  constructor(private http: HttpClient) {}

  getTodos(page: number = 1, limit: number = 10): Observable<PaginatedTodos> {
    this.loadingSignal.set(true);

    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http
      .get<PaginatedTodos>(`${this.API_URL}/todos`, { params })
      .pipe(
        tap((response) => {
          this.todosSignal.set(response.data);
          this.metaSignal.set(response.meta);
          this.loadingSignal.set(false);
        }),
      );
  }

  getTodo(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.API_URL}/todos/${id}`);
  }

  createTodo(todo: CreateTodoDto): Observable<Todo> {
    return this.http.post<Todo>(`${this.API_URL}/todos`, todo).pipe(
      tap((newTodo) => {
        this.todosSignal.update((todos) => [newTodo, ...todos]);
      }),
    );
  }

  updateTodo(id: number, todo: UpdateTodoDto): Observable<Todo> {
    return this.http.patch<Todo>(`${this.API_URL}/todos/${id}`, todo).pipe(
      tap((updatedTodo) => {
        this.todosSignal.update((todos) =>
          todos.map((t) => (t.id === id ? updatedTodo : t)),
        );
      }),
    );
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/todos/${id}`).pipe(
      tap(() => {
        this.todosSignal.update((todos) => todos.filter((t) => t.id !== id));
      }),
    );
  }

  toggleComplete(todo: Todo): Observable<Todo> {
    return this.updateTodo(todo.id, { completed: !todo.completed });
  }
}
