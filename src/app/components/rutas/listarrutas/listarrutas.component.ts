import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RutasService } from '../../../services/rutas.service';
import { LoginService } from '../../../services/login.service';
import { Rutas } from '../../../models/rutas';
import { RouterLink } from '@angular/router';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { JwtHelper } from '../../../utils/jwt-helper';

@Component({
  selector: 'app-listarrutas',
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
  ],
  templateUrl: './listarrutas.component.html',
  styleUrl: './listarrutas.component.css',
})
export class ListarrutasComponent implements OnInit {
  dataSource: MatTableDataSource<Rutas> = new MatTableDataSource();
  currentUsername: string = '';
  totalRutas: number = 0;
  filteredDataSource: MatTableDataSource<Rutas> = new MatTableDataSource();

  displayedColumns: string[] = [
    'c1',
    'c2',
    'c3',
    'c4',
    'c5',
    'c6',
    'c7',
    'c8',
    'c9',
    'c10',
  ];

  constructor(
    private rS: RutasService,
    private loginService: LoginService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getCurrentUsername();
    this.loadRutas();

    this.rS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.filteredDataSource = new MatTableDataSource(data);
      this.totalRutas = data.length;
    });
  }

  getCurrentUsername(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JwtHelper.decodeToken(token);
      this.currentUsername = payload?.username || '';
    }
  }

  loadRutas(): void {
    this.rS.list().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.filteredDataSource = new MatTableDataSource(data);
        this.totalRutas = data.length;
      },
      error: (error) => {
        console.error('Error al cargar rutas:', error);
        this.snackBar.open('Error al cargar las rutas', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      },
    });
  }

  isAdmin(): boolean {
    return this.loginService.hasRole('ROLE_ADMIN');
  }

  canEditRuta(rutaUserId: string): boolean {
    return this.isAdmin() || rutaUserId === this.currentUsername;
  }

  canDeleteRuta(rutaUserId: string): boolean {
    return this.isAdmin();
  }

  eliminar(id: number, nombreRuta: string, rutaUsername: string): void {
    if (!this.isAdmin()) {
      this.snackBar.open(
        'Solo administradores pueden eliminar rutas',
        'Cerrar',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        }
      );
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar eliminación',
        message: `¿Está seguro que desea eliminar la ruta "${nombreRuta}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
      panelClass: 'custom-dialog-container',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.rS.deleteA(id).subscribe({
          next: () => {
            this.snackBar.open('Ruta eliminada correctamente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            this.loadRutas();
          },
          error: (error) => {
            console.error('Error al eliminar ruta:', error);
            let errorMessage = 'Error al eliminar la ruta';

            if (error.status === 401 || error.status === 403) {
              errorMessage = 'Sin permisos';
            } else if (error.status === 409) {
              errorMessage = 'La ruta tiene datos relacionados';
            } else if (error.status === 404) {
              errorMessage = 'Ruta no encontrada';
            } else if (error.status === 500) {
              if (
                error.error &&
                error.error.includes('foreign key constraint')
              ) {
                errorMessage = 'La ruta tiene datos relacionados';
              } else {
                errorMessage = 'Error del servidor';
              }
            }

            this.snackBar.open(errorMessage, 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
          },
        });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();
    this.totalRutas = this.filteredDataSource.filteredData.length;
  }
}
