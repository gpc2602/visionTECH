import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtRequest } from '../models/jwtRequest';
import { JwtHelper } from '../utils/jwt-helper';
import { environment } from '../../environments/environments';

const base_url = environment.base;

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private authenticationSubject = new BehaviorSubject<boolean>(
    this.checkInitialAuth()
  );
  public isAuthenticated$ = this.authenticationSubject.asObservable();

  constructor(private http: HttpClient) {}

  private checkInitialAuth(): boolean {
    try {
      let token = localStorage.getItem('token');
      return !!token;
    } catch (error) {
      return false;
    }
  }

  login(request: JwtRequest) {
    return this.http.post(`${base_url}/login`, request);
  }

  verificar(): boolean {
    try {
      let token = localStorage.getItem('token');

      if (!token) {
        this.authenticationSubject.next(false);
        return false;
      }

      this.authenticationSubject.next(true);

      const isExpired = JwtHelper.isTokenExpired(token);
      if (isExpired) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error verificando token:', error);
      this.logout();
      return false;
    }
  }

  showRole(): string | null {
    let token = localStorage.getItem('token');

    // Verificar si el token existe
    if (!token) {
      return null;
    }

    try {
      const decodedToken = JwtHelper.decodeToken(token);
      const roles = decodedToken?.roles;

      // Tomar el primer rol
      if (roles && Array.isArray(roles) && roles.length > 0) {
        const rol = roles[0];
        return rol;
      }

      return null;
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  logout(): void {
    localStorage.clear();
    this.authenticationSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.authenticationSubject.next(true);
  }

  isAuthenticated(): boolean {
    return this.verificar();
  }

  showAllRoles(): string[] {
    let token = localStorage.getItem('token');
    if (!token) {
      return [];
    }

    try {
      const decodedToken = JwtHelper.decodeToken(token);
      const roles = decodedToken?.roles;

      if (roles && Array.isArray(roles)) {
        return roles;
      }

      return [];
    } catch (error) {
      console.error('Error decodificando token:', error);
      return [];
    }
  }

  hasRole(roleName: string): boolean {
    const roles = this.showAllRoles();
    return roles.includes(roleName);
  }
}
