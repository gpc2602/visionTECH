import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const seguridadGuard = () => {
  const lService = inject(LoginService);
  const router = inject(Router);

  const isAuthenticated = lService.verificar();

  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
