import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoginService } from '../services/login.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  // Agregar token a las peticiones si existe y no es la ruta de login o APIs externas
  let authReq = req;
  const token = loginService.getToken();

  // No agregar Authorization header para APIs externas
  const isExternalAPI = req.url.includes('googleapis.com') || 
                       req.url.includes('maps.googleapis.com') ||
                       req.url.includes('/login');

  if (token && !isExternalAPI) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        console.log('Token inválido o expirado, cerrando sesión');
        loginService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
