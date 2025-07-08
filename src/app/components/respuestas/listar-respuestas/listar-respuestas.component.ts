import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Respuesta } from '../../../models/respuestas';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { RespuestasService } from '../../../services/respuestas.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listar-respuestas',
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginator,
    RouterLink,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './listar-respuestas.component.html',
  styleUrl: './listar-respuestas.component.css',
})
export class ListarRespuestasComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Respuesta> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
  pcCantidadRegistros: number = 0;
  pcPageSizeOptions = [4, 8, 10];

  @ViewChild(MatPaginator) pcPaginator!: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    private rS: RespuestasService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.rS.list().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.pcCantidadRegistros = data.length;
        this.dataSource.paginator = this.pcPaginator;
      },
      error: (error) => {
        console.error('Error al cargar respuestas:', error);
      },
    });

    this.rS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.pcCantidadRegistros = data.length;
      this.dataSource.paginator = this.pcPaginator;
    });
  }

  eliminar(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar eliminación',
        message: '¿Está seguro que desea eliminar esta respuesta?',
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
            this.snackBar.open('Respuesta eliminada correctamente', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            this.rS.list().subscribe((data) => {
              this.rS.setList(data);
              this.dataSource = new MatTableDataSource(data);
              this.pcCantidadRegistros = data.length;
              this.dataSource.paginator = this.pcPaginator;
            });
          },
          error: (error) => {
            this.snackBar.open('Error al eliminar la respuesta', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            console.error('Error al eliminar respuesta:', error);
          },
        });
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.pcPaginator;
  }
}
