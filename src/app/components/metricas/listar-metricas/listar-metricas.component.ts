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
import { Metricas } from '../../../models/metricas';
import { MetricasService } from '../../../services/metricas.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listar-metricas',
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
  templateUrl: './listar-metricas.component.html',
  styleUrl: './listar-metricas.component.css',
})
export class ListarMetricasComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Metricas> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'];
  pcCantidadRegistros: number = 0;
  pcPageSizeOptions = [4, 8, 10];

  @ViewChild(MatPaginator) pcPaginator!: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    private metricasService: MetricasService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.metricasService.list().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.pcCantidadRegistros = data.length;
        this.dataSource.paginator = this.pcPaginator;
      },
      error: (error) => {
        console.error('Error al cargar métricas:', error);
      },
    });

    this.metricasService.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.pcCantidadRegistros = data.length;
      this.dataSource.paginator = this.pcPaginator;
    });
  }

  eliminar(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar eliminación',
        message: '¿Está seguro que desea eliminar esta métrica?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
      panelClass: 'custom-dialog-container',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.metricasService.deleteA(id).subscribe({
          next: () => {
            this.snackBar.open('Métrica eliminada correctamente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            this.metricasService.list().subscribe((data) => {
              this.metricasService.setList(data);
              this.dataSource = new MatTableDataSource(data);
              this.pcCantidadRegistros = data.length;
              this.dataSource.paginator = this.pcPaginator;
            });
          },
          error: (error) => {
            this.snackBar.open('Error al eliminar la métrica', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            console.error('Error al eliminar métrica:', error);
          },
        });
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.pcPaginator;
  }
}
