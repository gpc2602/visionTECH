import { Component, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [
    MatMenuModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatDividerModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  rol: string = '';
  isMenuOpen: boolean = false;
  openSubmenus: { [key: string]: boolean } = {};

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit() {
    this.rol = this.loginService.showRole() || '';
  }

  cerrar() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  isTester(): boolean {
    return this.loginService.hasRole('ROLE_TESTER');
  }

  isAdmin(): boolean {
    return this.loginService.hasRole('ROLE_ADMIN');
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.openSubmenus = {};
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    this.openSubmenus = {};
  }

  toggleSubmenu(submenuKey: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.openSubmenus[submenuKey] = !this.openSubmenus[submenuKey];
  }

  formatRol(rol: string) {
    switch (rol) {
      case 'ROLE_ADMIN':
        return 'Administrador';
      case 'ROLE_TESTER':
        return 'Tester';
      case 'ROLE_USER':
        return 'Usuario';
      default:
        return 'No definido';
    }
  }
}
