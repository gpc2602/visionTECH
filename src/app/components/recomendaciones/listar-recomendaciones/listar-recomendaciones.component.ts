import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Recomendaciones } from '../../../models/recomendaciones';
import { RecomendacionesService } from '../../../services/recomendaciones.service';
import { RutasService } from '../../../services/rutas.service';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-listar-recomendaciones',
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatFormField,
    MatFormFieldModule,
    MatPaginator,
    MatInputModule,
    MatLabel,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './listar-recomendaciones.component.html',
  styleUrl: './listar-recomendaciones.component.css',
})
export class ListarRecomendacionesComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Recomendaciones> = new MatTableDataSource();
  displayedColumns: string[] = [
    'id',
    'comentario',
    'puntuacion',
    'ruta',
    'editar',
    'eliminar',
  ];
  pcCantidadRegistros: number = 0;
  pcPageSizeOptions = [5, 10, 25];

  @ViewChild(MatPaginator) pcPaginator!: MatPaginator;

  constructor(
    private recomendacionesService: RecomendacionesService,
    private rutasService: RutasService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarRecomendaciones();
    this.recomendacionesService
      .getList()
      .subscribe((data: Recomendaciones[]) => {
        this.cargarRecomendaciones();
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.pcPaginator;
  }

  cargarRecomendaciones(): void {
    forkJoin({
      recomendaciones: this.recomendacionesService.list(),
      rutas: this.rutasService.list(),
    }).subscribe({
      next: (result) => {
        const recomendacionesConRutas = result.recomendaciones.map((rec) => {
          const rutaEncontrada = result.rutas.find(
            (r) => r.idRuta === rec.ruta.idRuta
          );
          if (rutaEncontrada) {
            rec.ruta.nombreRuta = rutaEncontrada.nombreRuta;
          }
          return rec;
        });
        this.actualizarTabla(recomendacionesConRutas);
      },
      error: (error) => {
        console.error('Error al cargar recomendaciones:', error);
        this.snackBar.open('Error al cargar las recomendaciones', 'OK', {
          duration: 3000,
        });
      },
    });
  }

  actualizarTabla(data: Recomendaciones[]): void {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.pcPaginator;
    this.pcCantidadRegistros = data.length;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  confirmarEliminacion(id: number, comentario: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar eliminación',
        message: `¿Está seguro que desea eliminar la recomendación "${comentario}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
      panelClass: 'custom-dialog-container',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eliminar(id);
      }
    });
  }

  eliminar(id: number): void {
    this.recomendacionesService.delete(id).subscribe({
      next: () => {
        this.cargarRecomendaciones();
        this.snackBar.open('Recomendación eliminada correctamente', 'OK', {
          duration: 3000,
        });
      },
      error: (error) => {
        console.error('Error al eliminar:', error);
        this.snackBar.open('Error al eliminar la recomendación', 'OK', {
          duration: 3000,
        });
      },
    });
  }
}
