import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ApiResponse } from '../../models/product';
import { ApiService } from '../../services/api-service';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  response = signal<ApiResponse<Product[]> | undefined>(undefined);
  selectedProduct = signal<Product | null>(null);
  loading = signal<boolean>(false);
  error = signal<string>('');
  showCreateModal = signal<boolean>(false);
  creatingProduct = signal<boolean>(false);
  
  // Expose Math for template
  Math = Math;
  
  // Pagination and Filters
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  searchTerm = signal<string>('');
  selectedCategory = signal<string>('');
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  sortBy = signal<string>('name');
  sortOrder = signal<string>('asc');
  
  newProduct: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    imageUrl: ''
  };
  
  private service = inject(ApiService);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    this.error.set('');
    
    const params: any = {
      page: this.currentPage(),
      pageSize: this.pageSize()
    };

    if (this.searchTerm()) {
      params.searchTerm = this.searchTerm();
    }
    if (this.selectedCategory()) {
      params.category = this.selectedCategory();
    }
    if (this.minPrice() !== null) {
      params.minPrice = this.minPrice();
    }
    if (this.maxPrice() !== null) {
      params.maxPrice = this.maxPrice();
    }
    if (this.sortBy()) {
      params.sortBy = this.sortBy();
    }
    if (this.sortOrder()) {
      params.sortOrder = this.sortOrder();
    }
    
    this.service.get<ApiResponse<Product[]>>('products', params).subscribe({
      next: (res) => {
        this.response.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error.set('Failed to load products. Please try again later.');
        this.loading.set(false);
      }
    });
  }

  viewProduct(product: Product) {
    this.selectedProduct.set(product);
  }

  closeDetails() {
    this.selectedProduct.set(null);
  }

  isInStock(product: Product): boolean {
    return product.stock > 0;
  }

  getStockStatus(product: Product): string {
    if (product.stock === 0) return 'Out of Stock';
    if (product.stock < 10) return `Low Stock (${product.stock})`;
    return 'In Stock';
  }

  openCreateModal() {
    this.showCreateModal.set(true);
    this.resetForm();
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
    this.resetForm();
  }

  resetForm() {
    this.newProduct = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      imageUrl: ''
    };
  }

  createProduct() {
    if (!this.validateProduct()) {
      return;
    }

    this.creatingProduct.set(true);
    
    this.service.post<ApiResponse<Product>>('products', this.newProduct).subscribe({
      next: (res) => {
        console.log('Product created:', res);
        this.creatingProduct.set(false);
        this.closeCreateModal();
        this.loadProducts(); // Reload the products list
      },
      error: (err) => {
        console.error('Error creating product:', err);
        this.error.set('Failed to create product. Please try again.');
        this.creatingProduct.set(false);
      }
    });
  }

  validateProduct(): boolean {
    if (!this.newProduct.name?.trim()) {
      this.error.set('Product name is required');
      return false;
    }
    if (this.newProduct.price <= 0) {
      this.error.set('Price must be greater than 0');
      return false;
    }
    if (!this.newProduct.category?.trim()) {
      this.error.set('Category is required');
      return false;
    }
    if (this.newProduct.stock < 0) {
      this.error.set('Stock cannot be negative');
      return false;
    }
    this.error.set('');
    return true;
  }

  // Search and Filter Methods
  onSearchChange(term: string) {
    this.searchTerm.set(term);
    this.currentPage.set(1); // Reset to first page on search
    this.loadProducts();
  }

  onCategoryChange(category: string) {
    this.selectedCategory.set(category);
    this.currentPage.set(1);
    this.loadProducts();
  }

  onPriceFilterChange(min: number | null, max: number | null) {
    this.minPrice.set(min);
    this.maxPrice.set(max);
    this.currentPage.set(1);
    this.loadProducts();
  }

  onSortChange(sortBy: string, sortOrder: string) {
    this.sortBy.set(sortBy);
    this.sortOrder.set(sortOrder);
    this.loadProducts();
  }

  clearFilters() {
    this.searchTerm.set('');
    this.selectedCategory.set('');
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.currentPage.set(1);
    this.loadProducts();
  }

  // Pagination Methods
  goToPage(page: number) {
    if (page < 1 || page > this.getTotalPages()) return;
    this.currentPage.set(page);
    this.loadProducts();
  }

  nextPage() {
    if (this.currentPage() < this.getTotalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadProducts();
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadProducts();
    }
  }

  getTotalPages(): number {
    return this.response()?.totalPages || 0;
  }

  getPageNumbers(): number[] {
    const total = this.getTotalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, -1, total);
      } else if (current >= total - 2) {
        pages.push(1, -1, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, -1, current - 1, current, current + 1, -1, total);
      }
    }
    
    return pages;
  }
}
