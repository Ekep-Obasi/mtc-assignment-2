import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User, UserRole } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private mockUsers: Array<User & { password: string }> = [
    {
      _id: 'u1',
      fullName: 'Resident Demo',
      email: 'resident@test.com',
      password: '123456',
      role: 'resident'
    },
    {
      _id: 'u2',
      fullName: 'Provider Demo',
      email: 'provider@test.com',
      password: '123456',
      role: 'provider'
    }
  ];

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserSubject.value?.role === role;
  }

  register(payload: {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
  }): Observable<User> {
    const exists = this.mockUsers.some(
      (u) => u.email.toLowerCase() === payload.email.toLowerCase()
    );

    if (exists) {
      return throwError(() => new Error('Email already exists.'));
    }

    const newUser: User & { password: string } = {
      _id: crypto.randomUUID(),
      fullName: payload.fullName,
      email: payload.email.toLowerCase(),
      password: payload.password,
      role: payload.role
    };

    this.mockUsers.push(newUser);

    return of({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role
    });
  }

  login(email: string, password: string): Observable<User> {
    const user = this.mockUsers.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!user) {
      return throwError(() => new Error('Invalid email or password.'));
    }

    const safeUser: User = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    };

    this.currentUserSubject.next(safeUser);
    return of(safeUser);
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }
}