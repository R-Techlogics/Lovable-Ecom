import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api-service';
import { Users, ApiResponse } from '../../models/user';

@Component({
  selector: 'app-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User implements OnInit {
  response = signal<ApiResponse<Users[]> | undefined>(undefined);
  selectedUser = signal<Users | undefined>(undefined);
  showModal = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  error = signal<string>('');
  loading = signal<boolean>(false);
  private service = inject(ApiService);

  
  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.service.get<ApiResponse<Users[]>>('users').subscribe({
      next: (res) => {
        this.response.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load users');
        this.loading.set(false);
      }
    });
  }

  loadUser(id: number) {
    this.service.getById<ApiResponse<Users>>('users', id).subscribe({
      next: (user) => {
        this.selectedUser.set(user.data); 
        this.isEditMode.set(false);
        this.showModal.set(true);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load user');
      }
    });
  }

  editUser(id: number) {
    this.service.getById<ApiResponse<Users>>('users', id).subscribe({
      next: (user) => {
        this.selectedUser.set({ ...user.data });
        this.isEditMode.set(true);
        this.showModal.set(true);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load user');
      }
    });
  }

  createUser() {
    const newUser: Users = {
      id: 0,
      email: '',
      firstName: '',
      lastName: '',
      role: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.selectedUser.set(newUser);
    this.isEditMode.set(true);
    this.showModal.set(true);
  }

  saveUser() {
    const user = this.selectedUser();
    if (!user) return;

    this.loading.set(true);
    
    // If id is 0 or undefined, it's a new user (POST), otherwise it's an update (PUT)
    const request = !user.id || user.id === 0
      ? this.service.post<ApiResponse<Users>>('users', user)
      : this.service.put<ApiResponse<Users>>('users', user.id, user);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.closeModal();
        this.loadUsers();
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to save user');
        this.loading.set(false);
      }
    });
  }

  closeModal() {
    this.showModal.set(false);
    this.isEditMode.set(false);
    this.selectedUser.set(undefined);
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.service.delete('users', id).subscribe({
        next: () => {
          this.loadUsers(); // Reload the list
        },
        error: (err) => {
          this.error.set(err.message || 'Failed to delete user');
        }
      });
    }
  }
}

