import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { UsuariosService } from '../../../services/usuarios.service';
import { LoginService } from '../../../services/login.service';
import { Usuarios } from '../../../models/usuarios';
import { RouterLink } from '@angular/router';
import { JwtHelper } from '../../../utils/jwt-helper';

@Component({
  selector: 'app-listarusuarios',
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './listarusuarios.component.html',
  styleUrl: './listarusuarios.component.css',
})
export class ListarusuariosComponent implements OnInit {
  dataSource: MatTableDataSource<Usuarios> = new MatTableDataSource();
  filteredDataSource: MatTableDataSource<Usuarios> = new MatTableDataSource();
  totalUsers: number = 0;
  currentUsername: string = '';

  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'];

  constructor(
    private uS: UsuariosService,
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCurrentUsername();
    this.loadUsers();

    this.uS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.filteredDataSource = new MatTableDataSource(data);
      this.totalUsers = data.length;
    });
  }

  loadUsers(): void {
    this.uS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.filteredDataSource = new MatTableDataSource(data);
      this.totalUsers = data.length;
    });
  }

  getCurrentUsername(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JwtHelper.decodeToken(token);
      this.currentUsername = payload?.username || '';
    }
  }

  canEditUser(username: string): boolean {
    const currentRoles = this.loginService.showAllRoles();
    const isAdmin = currentRoles.includes('ROLE_ADMIN');
    const isEditingSelf = username === this.currentUsername;

    return isAdmin || isEditingSelf;
  }

  canDeleteUser(username: string): boolean {
    const currentRoles = this.loginService.showAllRoles();
    const isAdmin = currentRoles.includes('ROLE_ADMIN');
    const isNotSelf = username !== this.currentUsername;

    return isAdmin && isNotSelf;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    const filteredData = this.dataSource.data.filter(
      (user) =>
        user.username
          .toLowerCase()
          .includes(filterValue.trim().toLowerCase()) ||
        user.nombre.toLowerCase().includes(filterValue.trim().toLowerCase()) ||
        user.correoElectronico
          .toLowerCase()
          .includes(filterValue.trim().toLowerCase()) ||
        user.telefono.toString().includes(filterValue.trim())
    );

    this.filteredDataSource = new MatTableDataSource(filteredData);
    this.totalUsers = filteredData.length;
  }

  eliminar(id: number, username: string): void {
    if (username === this.currentUsername) {
      this.snackBar.open('No se puede eliminar al usuario activo', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar eliminación',
        message: `¿Está seguro que desea eliminar al usuario "${username}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
      panelClass: 'custom-dialog-container',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.uS.deleteA(id).subscribe({
          next: () => {
            this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            this.loadUsers();
          },
          error: (error) => {
            this.snackBar.open('Error al eliminar el usuario', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            console.error('Error:', error);
          },
        });
      }
    });
  }
}
