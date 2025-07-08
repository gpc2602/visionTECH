import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const adminGuard = () => {
  const lService = inject(LoginService);
  const router = inject(Router);

  const isAuthenticated = lService.verificar();

  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }

  const isAdmin = lService.hasRole('ROLE_ADMIN');

  if (!isAdmin) {
    router.navigate(['/homes']);
    return false;
  }

  return true;
};
