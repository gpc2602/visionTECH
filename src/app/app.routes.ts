import { InsertarEditarUsuariosComponent } from './components/usuarios/insertar-editar-usuarios/insertar-editar-usuarios.component';
import { InsertarEditarIncidentesComponent } from './components/incidentes/insertar-editar-incidentes/insertar-editar-incidentes.component';
import { InsertarEditarCatmosfericasComponent } from './components/catmosfericas/insertar-editar-catmosfericas/insertar-editar-catmosfericas.component';
import { Routes } from '@angular/router';
import { RolesComponent } from './components/roles/roles.component';

import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { RutasComponent } from './components/rutas/rutas.component';
import { MetricasComponent } from './components/metricas/metricas.component';
import { CatmosfericasComponent } from './components/catmosfericas/catmosfericas.component';
import { IncidentesComponent } from './components/incidentes/incidentes.component';
import { RecomendacionesComponent } from './components/recomendaciones/recomendaciones.component';
import { ContactoEmergenciaComponent } from './components/contacto-emergencia/contacto-emergencia.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { InsertarEditarMetricasComponent } from './components/metricas/insertar-editar-metricas/insertar-editar-metricas.component';
import { AgregarActualizarRutasComponent } from './components/rutas/agregar-actualizar-rutas/agregar-actualizar-rutas.component';

import { InsertarEditarRolesComponent } from './components/roles/insertar-editar-roles/insertar-editar-roles.component';
import { seguridadGuard } from './guard/seguridad.guard';
import { adminGuard } from './guard/admin.guard';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { InsertarEditarRecomendacionesComponent } from './components/recomendaciones/insertar-editar-recomendaciones/insertar-editar-recomendaciones.component';
import { MapaDireccionComponent } from './components/mapa-direccion/mapa-direccion.component';
import { RespuestasComponent } from './components/respuestas/respuestas.component';
import { InsertarEditarRespuestasComponent } from './components/respuestas/insertar-editar-respuestas/insertar-editar-respuestas.component';
import { TemasforoComponent } from './components/temasforo/temasforo.component';
import { InsertarEditarTemasforoComponent } from './components/temasforo/insertar-editar-temasforo/insertar-editar-temasforo.component';
import { NavegacionComponent } from './components/navegacion/navegacion.component';

export const routes: Routes = [
  { path: '', redirectTo: 'navegacion', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'navegacion',
    component: NavegacionComponent,
  },
  {
    path: 'mapa',
    component: MapaDireccionComponent,
  },
  {
    path: '',
    redirectTo: 'usuarios',
    pathMatch: 'full',
  },
  {
    path: 'roles',
    component: RolesComponent,
    children: [
      { path: 'inserciones', component: InsertarEditarRolesComponent },
      { path: 'ediciones/:id', component: InsertarEditarRolesComponent },
    ],
    canActivate: [adminGuard],
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    children: [
      { path: 'inserciones', component: InsertarEditarUsuariosComponent },
      { path: 'ediciones/:id', component: InsertarEditarUsuariosComponent },
    ],
    canActivate: [adminGuard],
  },
  {
    path: 'rutas',
    component: RutasComponent,
    children: [
      { path: 'inserciones', component: AgregarActualizarRutasComponent },
      { path: 'ediciones/:id', component: AgregarActualizarRutasComponent },
      { path: 'mapa', component: MapaDireccionComponent },
    ],
    canActivate: [adminGuard],
  },
  {
    path: 'metricas',
    component: MetricasComponent,
    children: [
      { path: 'inserciones', component: InsertarEditarMetricasComponent },
      { path: 'ediciones/:id', component: InsertarEditarMetricasComponent },
    ],
    canActivate: [seguridadGuard],
  },
  {
    path: 'catmosferica',
    component: CatmosfericasComponent,
    children: [
      { path: 'inserciones', component: InsertarEditarCatmosfericasComponent },
      {
        path: 'ediciones/:id',
        component: InsertarEditarCatmosfericasComponent,
      },
    ],
    canActivate: [seguridadGuard],
  },
  {
    path: 'incidentes',
    component: IncidentesComponent,
    children: [
      { path: 'inserciones', component: InsertarEditarIncidentesComponent },
      { path: 'ediciones/:id', component: InsertarEditarIncidentesComponent },
    ],
    canActivate: [seguridadGuard],
  },
  {
    path: 'recomendaciones',
    component: RecomendacionesComponent,
    children: [
      {
        path: 'inserciones',
        component: InsertarEditarRecomendacionesComponent,
      },
      {
        path: 'ediciones/:id',
        component: InsertarEditarRecomendacionesComponent,
      },
    ],
    canActivate: [seguridadGuard],
  },
  { path: 'contactoemergencia', component: ContactoEmergenciaComponent },
  {
    path: 'respuesta',
    component: RespuestasComponent,
    children: [
      {
        path: 'inserciones',
        component: InsertarEditarRespuestasComponent,
      },
      {
        path: 'ediciones/:id',
        component: InsertarEditarRespuestasComponent,
      },
    ],
    canActivate: [seguridadGuard],
  },
  {
    path: 'temaforo',
    component: TemasforoComponent,
    children: [
      {
        path: 'inserciones',
        component: InsertarEditarTemasforoComponent,
      },
      {
        path: 'ediciones/:id',
        component: InsertarEditarTemasforoComponent,
      },
    ],
    canActivate: [seguridadGuard],
  },
  {
    path: 'homes',
    component: HomeComponent,
    canActivate: [seguridadGuard],
  },
  {
    path: 'reportes',
    component: ReportesComponent,
    canActivate: [seguridadGuard],
  },
];
