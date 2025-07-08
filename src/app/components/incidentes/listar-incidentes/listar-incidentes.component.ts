import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { Incidente } from '../../../models/incidentes';
import { IncidentesService } from '../../../services/incidentes.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listar-incidentes',
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginator,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './listar-incidentes.component.html',
  styleUrl: './listar-incidentes.component.css',
})
export class ListarIncidentesComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Incidente> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'];
  pcCantidadRegistros: number = 0;
  pcPageSizeOptions = [4, 8, 10];

  @ViewChild(MatPaginator) pcPaginator!: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    private incidentesService: IncidentesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  getGravedadColor(gravedad: string): string {
    switch (gravedad?.toLowerCase()) {
      case 'alta':
        return '#e74c3c'; // Rojo
      case 'media':
        return '#f39c12'; // Naranja
      case 'baja':
        return '#27ae60'; // Verde
      default:
        return '#6c757d'; // Gris
    }
  }

  ngOnInit(): void {
    this.incidentesService.list().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.pcCantidadRegistros = data.length;
        this.dataSource.paginator = this.pcPaginator;
      },
      error: (error) => {
        console.error('Error al cargar incidentes:', error);
      },
    });

    this.incidentesService.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.pcCantidadRegistros = data.length;
      this.dataSource.paginator = this.pcPaginator;
    });
  }

  eliminar(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar eliminación',
        message: '¿Está seguro que desea eliminar este incidente?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
      panelClass: 'custom-dialog-container',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.incidentesService.deleteA(id).subscribe({
          next: () => {
            this.snackBar.open('Incidente eliminado correctamente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            this.incidentesService.list().subscribe((data) => {
              this.incidentesService.setList(data);
              this.dataSource = new MatTableDataSource(data);
              this.pcCantidadRegistros = data.length;
              this.dataSource.paginator = this.pcPaginator;
            });
          },
          error: (error) => {
            this.snackBar.open('Error al eliminar el incidente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            console.error('Error al eliminar incidente:', error);
          },
        });
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.pcPaginator;
  }
}
