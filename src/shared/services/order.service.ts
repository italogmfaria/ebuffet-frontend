import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface OrderItem {
  id?: number;
  title: string;
  description: string;
  imageUrl?: string;
  quantity: number;
  price?: number;
  type?: 'food' | 'service';
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderItems = new BehaviorSubject<OrderItem[]>([]);
  public orderItems$ = this.orderItems.asObservable();

  constructor() {
    // Load from localStorage if available
    const savedItems = localStorage.getItem('orderItems');
    if (savedItems) {
      this.orderItems.next(JSON.parse(savedItems));
    }
  }

  getOrderItems(): OrderItem[] {
    return this.orderItems.value;
  }

  addItem(item: Omit<OrderItem, 'quantity'>): void {
    const currentItems = this.orderItems.value;
    const existingItemIndex = currentItems.findIndex(
      (i) => i.title === item.title
    );

    if (existingItemIndex > -1) {
      // Item already exists, increase quantity
      currentItems[existingItemIndex].quantity += 1;
    } else {
      // New item, add with quantity 1
      currentItems.push({ ...item, quantity: 1 });
    }

    this.orderItems.next([...currentItems]);
    this.saveToLocalStorage();
  }

  removeItem(title: string): void {
    const currentItems = this.orderItems.value;
    const existingItemIndex = currentItems.findIndex(
      (i) => i.title === title
    );

    if (existingItemIndex > -1) {
      currentItems.splice(existingItemIndex, 1);
      this.orderItems.next([...currentItems]);
      this.saveToLocalStorage();
    }
  }

  updateQuantity(title: string, newQuantity: number): void {
    const currentItems = this.orderItems.value;
    const existingItemIndex = currentItems.findIndex(
      (i) => i.title === title
    );

    if (existingItemIndex > -1) {
      currentItems[existingItemIndex].quantity = newQuantity;
      this.orderItems.next([...currentItems]);
      this.saveToLocalStorage();
    }
  }

  getTotalItems(): number {
    return this.orderItems.value.reduce((total, item) => total + item.quantity, 0);
  }

  clearOrder(): void {
    this.orderItems.next([]);
    localStorage.removeItem('orderItems');
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('orderItems', JSON.stringify(this.orderItems.value));
  }
}
