import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Products } from './products';
import { provideHttpClient } from '@angular/common/http';

describe('Products', () => {
  let component: Products;
  let fixture: ComponentFixture<Products>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Products],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Products);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have loading state initially', () => {
    expect(component.loading()).toBe(true);
  });

  it('should select a product', () => {
    const product = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      category: 'Electronics',
      stock: 10
    };
    component.viewProduct(product);
    expect(component.selectedProduct()).toEqual(product);
  });

  it('should close product details', () => {
    const product = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      category: 'Electronics',
      stock: 10
    };
    component.viewProduct(product);
    component.closeDetails();
    expect(component.selectedProduct()).toBeNull();
  });

  it('should check if product is in stock', () => {
    const inStockProduct = { id: 1, name: 'Test', description: '', price: 99, category: 'Test', stock: 5 };
    const outOfStockProduct = { id: 2, name: 'Test2', description: '', price: 99, category: 'Test', stock: 0 };
    
    expect(component.isInStock(inStockProduct)).toBe(true);
    expect(component.isInStock(outOfStockProduct)).toBe(false);
  });
});
