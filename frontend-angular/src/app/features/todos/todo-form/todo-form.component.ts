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

import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoService, Todo } from '../../../core/services/todo.service';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
})
export class TodoFormComponent implements OnInit {
  @Input() todo: Todo | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  todoForm!: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
  ) {}

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      title: [this.todo?.title || '', [Validators.required]],
      description: [this.todo?.description || ''],
    });
  }

  get isEditing(): boolean {
    return !!this.todo;
  }

  onSubmit(): void {
    if (this.todoForm.invalid) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const todoData = this.todoForm.value;

    if (this.isEditing && this.todo) {
      this.todoService.updateTodo(this.todo.id, todoData).subscribe({
        next: () => {
          this.loading.set(false);
          this.saved.emit();
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error?.message || 'Cập nhật thất bại');
        },
      });
    } else {
      this.todoService.createTodo(todoData).subscribe({
        next: () => {
          this.loading.set(false);
          this.saved.emit();
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error?.message || 'Tạo todo thất bại');
        },
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
