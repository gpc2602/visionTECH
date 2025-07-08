import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { Rutas } from '../../../models/rutas';
import { UsuariosService } from '../../../services/usuarios.service';
import { RutasService } from '../../../services/rutas.service';
import { LoginService } from '../../../services/login.service';
import { Usuarios } from '../../../models/usuarios';
import { JwtHelper } from '../../../utils/jwt-helper';

@Component({
  selector: 'app-agregar-actualizar-rutas',
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  templateUrl: './agregar-actualizar-rutas.component.html',
  styleUrl: './agregar-actualizar-rutas.component.css',
})
export class AgregarActualizarRutasComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  ver: Rutas = new Rutas();
  estado: boolean = true;
  currentUsername: string = '';
  originalUserId: number = 0;

  id: number = 0;
  edicion: boolean = false;

  listaUsuarios: Usuarios[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private rS: RutasService,
    private router: Router,
    private uS: UsuariosService,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getCurrentUsername();
    this.initializeForm();
    this.loadUsuarios();
    
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });
  }

  initializeForm(): void {
    this.form = this.formBuilder.group({
      codigo: [''],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      destino: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      inicio: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      distancia: ['', [Validators.required, Validators.min(0.1), Validators.pattern(/^\d+(\.\d+)?$/)]],
      favorito: [false, Validators.required],
      tiempo: ['', [Validators.required, Validators.min(0.1), Validators.pattern(/^\d+(\.\d+)?$/)]],
      longitud: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/), Validators.min(-180), Validators.max(180)]],
      latitud: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/), Validators.min(-90), Validators.max(90)]],
      usuario: [{ value: '', disabled: false }, Validators.required],
    });
  }

  getCurrentUsername(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JwtHelper.decodeToken(token);
      this.currentUsername = payload?.username || '';
    }
  }

  loadUsuarios(): void {
    this.uS.list().subscribe({
      next: (data) => {
        this.listaUsuarios = data;
        
        this.updateUsuarioFieldState();
        
        if (!this.isAdmin() && !this.edicion) {
          const currentUser = data.find(u => u.username === this.currentUsername);
          if (currentUser) {
            this.form.patchValue({ usuario: currentUser.idUsuario });
          }
        }
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.showErrorMessage('Error al cargar la lista de usuarios');
      }
    });
  }

  updateUsuarioFieldState(): void {
    const usuarioControl = this.form.get('usuario');
    if (usuarioControl) {
      if (!this.isAdmin() && this.edicion) {
        usuarioControl.disable();
      } else {
        usuarioControl.enable();
      }
    }
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }

  isAdmin(): boolean {
    return this.loginService.hasRole('ROLE_ADMIN');
  }

  canEditRuta(): boolean {
    if (!this.edicion) return true;
    
    const isAdmin = this.isAdmin();
    const currentUser = this.listaUsuarios.find(u => u.username === this.currentUsername);
    const isOwner = !!(currentUser && currentUser.idUsuario === this.originalUserId);
    
    return isAdmin || isOwner;
  }

  aceptar() {
    if (this.form.valid) {
      if (this.edicion && !this.canEditRuta()) {
        this.showErrorMessage('No tiene permisos para actualizar esta ruta');
        return;
      }

      const longitud = parseFloat(this.form.value.longitud);
      const latitud = parseFloat(this.form.value.latitud);
      
      if (longitud < -180 || longitud > 180) {
        this.showErrorMessage('La longitud debe estar entre -180 y 180 grados');
        return;
      }
      
      if (latitud < -90 || latitud > 90) {
        this.showErrorMessage('La latitud debe estar entre -90 y 90 grados');
        return;
      }

      this.ver.idRuta = this.form.value.codigo;
      this.ver.nombreRuta = this.form.value.nombre.trim();
      this.ver.destino = this.form.value.destino.trim();
      this.ver.inicio = this.form.value.inicio.trim();
      this.ver.distanciaMetros = parseFloat(this.form.value.distancia);
      this.ver.favorito = this.form.value.favorito;
      this.ver.tiempoRuta = parseFloat(this.form.value.tiempo);
      this.ver.longitud = longitud;
      this.ver.latitud = latitud;
      
      const usuarioValue = this.form.get('usuario')?.value || this.form.get('usuario')?.getRawValue();
      this.ver.usuario = { idUsuario: usuarioValue } as Usuarios;

      if (this.edicion) {
        this.actualizarRuta();
      } else {
        this.insertarRuta();
      }
    } else {
      this.markFormGroupTouched();
      this.showErrorMessage('Por favor, complete todos los campos requeridos correctamente');
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  private actualizarRuta(): void {
    this.rS.update(this.ver).subscribe({
      next: () => {
        this.showSuccessMessage('Ruta actualizada correctamente');
        this.refreshList();
        this.router.navigate(['rutas']);
      },
      error: (error) => {
        console.error('Error al actualizar ruta:', error);
        if (error.status === 401 || error.status === 403) {
          this.showErrorMessage('No tiene permisos para realizar esta acción');
        } else if (error.status === 404) {
          this.showErrorMessage('La ruta no existe o fue eliminada');
        } else {
          this.showErrorMessage('Error al actualizar la ruta. Verifique los datos.');
        }
      },
    });
  }

  private insertarRuta(): void {
    this.rS.insert(this.ver).subscribe({
      next: () => {
        this.showSuccessMessage('Ruta registrada correctamente');
        this.refreshList();
        this.router.navigate(['rutas']);
      },
      error: (error) => {
        console.error('Error al insertar ruta:', error);
        if (error.status === 401 || error.status === 403) {
          this.showErrorMessage('No tiene permisos para realizar esta acción');
        } else {
          this.showErrorMessage('Error al registrar la ruta. Verifique los datos.');
        }
      },
    });
  }

  private refreshList(): void {
    this.rS.list().subscribe((data) => {
      this.rS.setList(data);
    });
  }

  cancelar() {
    if (this.hasFormChanges()) {
      const confirmExit = confirm('Tiene cambios sin guardar. ¿Está seguro de que desea salir sin guardar?');
      if (!confirmExit) {
        return;
      }
    }
    this.router.navigate(['rutas']);
  }

  init() {
    if (this.edicion) {
      this.rS.listId(this.id).subscribe({
        next: (data) => {
          this.originalUserId = data.usuario?.idUsuario || 0;
          
          this.form.patchValue({
            codigo: data.idRuta,
            nombre: data.nombreRuta,
            destino: data.destino,
            inicio: data.inicio,
            distancia: data.distanciaMetros,
            favorito: data.favorito,
            tiempo: data.tiempoRuta,
            longitud: data.longitud,
            latitud: data.latitud,
            usuario: data.usuario?.idUsuario
          });
          
          this.updateUsuarioFieldState();
          
          this.estado = data.favorito;
        },
        error: (error) => {
          console.error('Error al cargar datos de la ruta:', error);
          if (error.status === 404) {
            this.showErrorMessage('La ruta no existe o fue eliminada');
          } else if (error.status === 403) {
            this.showErrorMessage('No tiene permisos para ver esta ruta');
          } else {
            this.showErrorMessage('Error al cargar los datos de la ruta');
          }
          this.router.navigate(['rutas']);
        },
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} es obligatorio`;
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `${this.getFieldLabel(fieldName)} no puede exceder ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['min']) return `${this.getFieldLabel(fieldName)} debe ser mayor a ${field.errors['min'].min}`;
      if (field.errors['max']) return `${this.getFieldLabel(fieldName)} debe ser menor a ${field.errors['max'].max}`;
      if (field.errors['pattern']) return `${this.getFieldLabel(fieldName)} tiene un formato inválido`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'nombre': 'El nombre',
      'destino': 'El destino',
      'inicio': 'El punto de inicio',
      'distancia': 'La distancia',
      'tiempo': 'El tiempo',
      'longitud': 'La longitud',
      'latitud': 'La latitud',
      'usuario': 'El usuario'
    };
    return labels[fieldName] || 'Este campo';
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field?.errors && field?.touched);
  }

  resetForm(): void {
    this.form.reset();
    this.initializeForm();
    
    // Si no es admin, volver a seleccionar automaticamente el usuario actual
    if (!this.isAdmin()) {
      const currentUser = this.listaUsuarios.find(u => u.username === this.currentUsername);
      if (currentUser) {
        this.form.patchValue({ usuario: currentUser.idUsuario });
      }
    }
    
    // Resetear estado
    this.estado = false;
    this.ver = new Rutas();
  }

  // Método para validar si el formulario tiene cambios
  hasFormChanges(): boolean {
    return this.form.dirty;
  }

  // Método para manejar navegación con cambios pendientes
  canDeactivate(): boolean {
    if (this.hasFormChanges()) {
      return confirm('Tiene cambios sin guardar. ¿Está seguro de que desea salir?');
    }
    return true;
  }
}
