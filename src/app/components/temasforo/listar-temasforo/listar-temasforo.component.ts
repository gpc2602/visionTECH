import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Temaforo } from '../../../models/temasforo';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TemasforoService } from '../../../services/temasforo.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-listar-temasforo',
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginator,
    RouterLink,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './listar-temasforo.component.html',
  styleUrl: './listar-temasforo.component.css',
})
export class ListarTemasforoComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Temaforo> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'];
  pcCantidadRegistros: number = 0;
  pcPageSizeOptions = [4, 8, 10];

  @ViewChild(MatPaginator) pcPaginator!: MatPaginator;

  constructor(
    private rS: TemasforoService, 
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.pcPaginator;
  }

  ngOnInit(): void {
    this.rS.list().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.pcCantidadRegistros = data.length;
        this.dataSource.paginator = this.pcPaginator;
      },
      error: (error) => {
        console.error('Error al cargar temas del foro:', error);
      },
    });

    this.rS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.pcCantidadRegistros = data.length;
      this.dataSource.paginator = this.pcPaginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  eliminar(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar eliminación',
        message: '¿Está seguro que desea eliminar este tema del foro?',
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
            this.rS.list().subscribe((data) => {
              this.rS.setList(data);
              this.dataSource = new MatTableDataSource(data);
              this.pcCantidadRegistros = data.length;
              this.dataSource.paginator = this.pcPaginator;
            });
            this.snackBar.open('Tema eliminado correctamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar'],
            });
          },
          error: (error) => {
            console.error('Error al eliminar tema:', error);

            if (error.status === 409) {
              const errorMessage =
                error.error?.message || 'Error al eliminar el tema';
              this.snackBar.open(errorMessage, 'Cerrar', {
                duration: 5000,
                panelClass: ['error-snackbar'],
              });
            } else {
              this.snackBar.open('Error al eliminar el tema del foro', 'Cerrar', {
                duration: 3000,
                panelClass: ['error-snackbar'],
              });
            }
          },
        });
      }
    });
  }
}
