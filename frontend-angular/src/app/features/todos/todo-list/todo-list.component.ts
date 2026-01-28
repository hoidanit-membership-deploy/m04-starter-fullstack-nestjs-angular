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

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TodoService, Todo } from '../../../core/services/todo.service';
import { AuthService } from '../../../core/services/auth.service';
import { TodoFormComponent } from '../todo-form/todo-form.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TodoFormComponent],
  templateUrl: './todo-list.component.html',
})
export class TodoListComponent implements OnInit {
  showForm = signal(false);
  editingTodo = signal<Todo | null>(null);
  currentPage = signal(1);
  limit = 10;

  constructor(
    public todoService: TodoService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getTodos(this.currentPage(), this.limit).subscribe();
  }

  onToggleComplete(todo: Todo): void {
    this.todoService.toggleComplete(todo).subscribe();
  }

  onDelete(todo: Todo): void {
    if (confirm('Bạn có chắc muốn xóa todo này?')) {
      this.todoService.deleteTodo(todo.id).subscribe(() => {
        this.loadTodos();
      });
    }
  }

  onEdit(todo: Todo): void {
    this.editingTodo.set(todo);
    this.showForm.set(true);
  }

  onAddNew(): void {
    this.editingTodo.set(null);
    this.showForm.set(true);
  }

  onFormClose(): void {
    this.showForm.set(false);
    this.editingTodo.set(null);
  }

  onFormSaved(): void {
    this.showForm.set(false);
    this.editingTodo.set(null);
    this.loadTodos();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadTodos();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
