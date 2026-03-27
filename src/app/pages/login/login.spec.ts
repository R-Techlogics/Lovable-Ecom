import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideHttpClient(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate email format', () => {
    component.credentials.email = 'invalid-email';
    component.credentials.password = 'password123';
    expect(component.validateForm()).toBe(false);
    expect(component.error()).toContain('valid email');
  });

  it('should require password', () => {
    component.credentials.email = 'test@example.com';
    component.credentials.password = '';
    expect(component.validateForm()).toBe(false);
    expect(component.error()).toContain('required');
  });
});
