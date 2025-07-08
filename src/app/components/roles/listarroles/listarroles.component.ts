import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import {
  UserRoleService,
  UsuarioConRolesDTO,
} from '../../../services/user-role.service';

@Component({
  selector: 'app-listarroles',
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatChipsModule,
  ],
  templateUrl: './listarroles.component.html',
  styleUrl: './listarroles.component.css',
})
export class ListarrolesComponent implements OnInit {
  dataSource: MatTableDataSource<UsuarioConRolesDTO> = new MatTableDataSource();
  totalRecords = 0;

  displayedColumns: string[] = [
    'usuario',
    'nombre',
    'email',
    'roles',
    'acciones',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userRoleService: UserRoleService,
  ) {}

  ngOnInit(): void {
    this.cargarDatos();

    this.userRoleService.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.totalRecords = data.length;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarDatos() {
    this.userRoleService.listarTodosUsuariosConRoles().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.totalRecords = data.length;
    });
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  formatRole(rol: string): string {
    switch (rol) {
      case 'ROLE_ADMIN':
        return 'Administrador';
      case 'ROLE_TESTER':
        return 'Tester';
      case 'ROLE_USER':
        return 'Usuario';
      default:
        return rol;
    }
  }

  getRoleColor(rol: string): string {
    switch (rol) {
      case 'ROLE_ADMIN':
        return '#f44336'; // Rojo
      case 'ROLE_TESTER':
        return '#ff9800'; // Naranja
      case 'ROLE_USER':
        return '#4caf50'; // Verde
      default:
        return '#9e9e9e'; // Gris
    }
  }
}
