import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CEmergencia } from '../../../models/contactoemergencia';
import { ContactoemergenciaService } from '../../../services/contactoemergencia.service';
import { RouterLink } from '@angular/router';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-listar-contactos-emergencia',
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
  ],
  templateUrl: './listar-contactos-emergencia.component.html',
  styleUrl: './listar-contactos-emergencia.component.css',
})
export class ListarContactosEmergenciaComponent
  implements OnInit, AfterViewInit
{
  dataSource: MatTableDataSource<CEmergencia> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
  pcCantidadRegistros: number = 0;
  pcPageSizeOptions = [4, 8, 10];

  @ViewChild(MatPaginator) pcPaginator!: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    private ceS: ContactoemergenciaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.ceS.list().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.pcCantidadRegistros = data.length;
        this.dataSource.paginator = this.pcPaginator;
      },
      error: (error) => {
        console.error('Error al cargar contactos de emergencia:', error);
      },
    });

    this.ceS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.pcCantidadRegistros = data.length;
      this.dataSource.paginator = this.pcPaginator;
    });
  }

  eliminar(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar eliminación',
        message:
          '¿Está seguro de que desea eliminar este contacto de emergencia?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ceS.deleteA(id).subscribe({
          next: () => {
            this.ceS.list().subscribe((data) => {
              this.ceS.setList(data);
              this.dataSource = new MatTableDataSource(data);
              this.pcCantidadRegistros = data.length;
              this.dataSource.paginator = this.pcPaginator;
            });
          },
          error: (error) => {
            console.error('Error al eliminar contacto de emergencia:', error);
          },
        });
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.pcPaginator;
  }
}
