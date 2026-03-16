import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, UserRole } from '../../models/user.model';
import { environment } from '../../environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private url = `${environment.apiUrl}/auth`;

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserSubject.value?.role === role;
  }

  register(payload: { fullName: string; email: string; password: string; role: UserRole }): Observable<User> {
    return this.http.post<User>(`${this.url}/register`, payload);
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.url}/login`, { email, password }).pipe(
      tap((user) => this.currentUserSubject.next(user))
    );
  }

  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.url}/logout`, {}).pipe(
      tap(() => this.currentUserSubject.next(null))
    );
  }

  // check session on app startup or guard check
  checkSession(): Observable<User> {
    return this.http.get<User>(`${this.url}/me`).pipe(
      tap((user) => this.currentUserSubject.next(user))
    );
  }
}
