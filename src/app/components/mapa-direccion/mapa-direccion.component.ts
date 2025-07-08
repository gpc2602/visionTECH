import { Component, OnInit, ViewChild } from '@angular/core';
import { GeolocalizacionService } from '../../services/geolocalizacion.service';
import { TextToSpeechService } from '../../services/text-to-speech.service';
import { GoogleMapsModule, MapInfoWindow } from '@angular/google-maps';
import { Rutas } from '../../models/rutas';
import { RutasService } from '../../services/rutas.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mapa-direccion',
  imports: [
    GoogleMapsModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './mapa-direccion.component.html',
  styleUrl: './mapa-direccion.component.css',
})
export class MapaDireccionComponent implements OnInit {
  rutas: Rutas[] = [];
  marcadores: { lat: number; lng: number; label: string; info: string }[] = [];

  center: { lat: number; lng: number } = { lat: -12.0464, lng: -77.0428 };
  zoom = 12;

  nuevaPosicion: { lat: number; lng: number } | null = null;
  destinoPosicion: { lat: number; lng: number } | null = null;
  seleccionandoDestino = false;

  rutaForm: FormGroup;
  selectedInfo = '';
  mostrarAlerta = false;
  
  // Nuevas propiedades para el manejo de voz
  reproduciendo = false;
  mensajeVoz = '';

  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  constructor(
    private geoService: GeolocalizacionService,
    private rutasService: RutasService,
    private fb: FormBuilder,
    private textToSpeech: TextToSpeechService
  ) {
    this.rutaForm = this.fb.group({
      nombreRuta: ['', [Validators.required, Validators.minLength(3)]],
      inicio: ['', Validators.required],
      destino: ['', Validators.required],
      distanciaMetros: [0, [Validators.required, Validators.min(1)]],
      tiempoRuta: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.cargarRutas();
  }

  cargarRutas(): void {
    this.rutasService.list().subscribe((data) => {
      this.rutas = data;
      this.marcadores = [];

      this.rutas.forEach((ruta) => {
        if (ruta.latitud && ruta.longitud) {
          const infoTexto = `
            🛣️ <strong>${ruta.nombreRuta}</strong><br>
            📍 Inicio: ${ruta.inicio}<br>
            🎯 Destino: ${ruta.destino}<br>
            📏 Distancia: ${ruta.distanciaMetros}m<br>
            ⏱️ Tiempo: ${ruta.tiempoRuta}min
          `;

          this.marcadores.push({
            lat: ruta.latitud,
            lng: ruta.longitud,
            label: ruta.nombreRuta || '',
            info: infoTexto,
          });
        } else {
          this.geoService.getCoordinates(ruta.inicio).subscribe({
            next: (resp) => {
              if (
                resp.status === 'OK' &&
                resp.results &&
                resp.results.length > 0
              ) {
                const location = resp.results[0].geometry.location;

                const infoTexto = `
                  🛣️ <strong>${ruta.nombreRuta}</strong><br>
                  📍 Inicio: ${ruta.inicio}<br>
                  🎯 Destino: ${ruta.destino}<br>
                  📏 Distancia: ${ruta.distanciaMetros}m<br>
                  ⏱️ Tiempo: ${ruta.tiempoRuta}min
                `;

                this.marcadores.push({
                  lat: location.lat,
                  lng: location.lng,
                  label: ruta.nombreRuta || '',
                  info: infoTexto,
                });
              }
            },
            error: (error) => {
              const infoTexto = `
                🛣️ <strong>${ruta.nombreRuta}</strong><br>
                📍 Inicio: ${ruta.inicio}<br>
                🎯 Destino: ${ruta.destino}<br>
                📏 Distancia: ${ruta.distanciaMetros}m<br>
                ⏱️ Tiempo: ${ruta.tiempoRuta}min<br>
                ⚠️ Ubicación aproximada
              `;

              const offsetLat = (Math.random() - 0.5) * 0.02;
              const offsetLng = (Math.random() - 0.5) * 0.02;

              this.marcadores.push({
                lat: this.center.lat + offsetLat,
                lng: this.center.lng + offsetLng,
                label: ruta.nombreRuta || '',
                info: infoTexto,
              });
            },
          });
        }
      });

      setTimeout(() => {
        console.log('Total de marcadores en el mapa:', this.marcadores.length);
        console.log('Marcadores:', this.marcadores);
      }, 2000);
    });
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      if (this.seleccionandoDestino) {
        this.destinoPosicion = { lat, lng };
        this.seleccionandoDestino = false;
        this.rutaForm.patchValue({
          destino: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        });
        this.calcularDistancia();
        
        this.anunciarUbicacion(lat, lng, 'destino');
      } else if (!this.nuevaPosicion) {
        this.nuevaPosicion = { lat, lng };
        this.rutaForm.patchValue({
          inicio: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        });
        
        this.anunciarUbicacion(lat, lng, 'inicio');
      }
    }
  }

  seleccionarDestino() {
    this.seleccionandoDestino = true;
    this.destinoPosicion = null;
    this.rutaForm.patchValue({
      destino: '',
    });
  }

  calcularDistancia() {
    if (this.nuevaPosicion && this.destinoPosicion) {
      const R = 6371000;
      const lat1 = (this.nuevaPosicion.lat * Math.PI) / 180;
      const lat2 = (this.destinoPosicion.lat * Math.PI) / 180;
      const deltaLat =
        ((this.destinoPosicion.lat - this.nuevaPosicion.lat) * Math.PI) / 180;
      const deltaLng =
        ((this.destinoPosicion.lng - this.nuevaPosicion.lng) * Math.PI) / 180;

      const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) *
          Math.cos(lat2) *
          Math.sin(deltaLng / 2) *
          Math.sin(deltaLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distancia = Math.round(R * c);
      this.rutaForm.patchValue({
        distanciaMetros: distancia,
      });
    }
  }

  registrarRuta() {
    if (this.rutaForm.valid) {
      const formValue = this.rutaForm.value;
      const nueva: any = {
        nombreRuta: formValue.nombreRuta,
        inicio: formValue.inicio,
        destino: formValue.destino,
        distanciaMetros: formValue.distanciaMetros,
        tiempoRuta: formValue.tiempoRuta,
        latitud: this.nuevaPosicion?.lat,
        longitud: this.nuevaPosicion?.lng,
        favorito: false,
        usuario: { idUsuario: 1 },
      };

      this.rutasService.insert(nueva).subscribe(() => {
        this.rutaForm.reset();
        this.nuevaPosicion = null;
        this.destinoPosicion = null;
        this.seleccionandoDestino = false;

        this.cargarRutas();

        this.mostrarAlerta = true;
        setTimeout(() => {
          this.mostrarAlerta = false;
        }, 3000);
      });
    }
  }

  cancelarRegistro() {
    this.nuevaPosicion = null;
    this.destinoPosicion = null;
    this.seleccionandoDestino = false;
    this.rutaForm.reset();
    
    this.textToSpeech.stop();
    this.reproduciendo = false;
    this.mensajeVoz = '';
  }

  detenerVoz() {
    this.textToSpeech.stop();
    this.reproduciendo = false;
    this.mensajeVoz = '';
  }

  openInfo(m: any, event: google.maps.MapMouseEvent) {
    this.selectedInfo = m.info;
    if (event.domEvent && event.domEvent.target) {
      setTimeout(() => {
        this.infoWindow.open();
      }, 0);
    }
  }

  private anunciarUbicacion(lat: number, lng: number, tipo: 'inicio' | 'destino'): void {
    if (!this.textToSpeech.isSupported()) {
      console.log('Text-to-speech no soportado en este navegador');
      return;
    }

    this.reproduciendo = true;
    this.mensajeVoz = 'Obteniendo información del lugar...';

    this.geoService.getAddressFromCoordinates(lat, lng).subscribe({
      next: (response) => {
        if (response.status === 'OK' && response.results && response.results.length > 0) {
          const result = response.results[0];
          let nombreLugar = '';

          const componentesTipos = [
            'establishment',
            'point_of_interest',
            'subpremise',
            'premise',
            'street_address',
            'route',
            'neighborhood',
            'sublocality',
            'locality'
          ];

          for (const tipo of componentesTipos) {
            const componente = result.address_components.find((comp: any) => 
              comp.types.includes(tipo)
            );
            if (componente) {
              nombreLugar = componente.long_name;
              break;
            }
          }

          if (!nombreLugar) {
            nombreLugar = result.formatted_address;
          }

          let mensaje = '';
          if (tipo === 'inicio') {
            mensaje = `Punto de inicio seleccionado: ${nombreLugar}`;
          } else {
            mensaje = `Destino seleccionado: ${nombreLugar}`;
          }

          this.mensajeVoz = mensaje;

          // Reproducir el mensaje
          this.textToSpeech.speak(mensaje)
            .then(() => {
              this.reproduciendo = false;
              this.mensajeVoz = '';
            })
            .catch(error => {
              console.error('Error al reproducir mensaje de voz:', error);
              this.reproduciendo = false;
              this.mensajeVoz = '';
            });

          if (tipo === 'inicio') {
            this.rutaForm.patchValue({
              inicio: nombreLugar
            });
          } else {
            this.rutaForm.patchValue({
              destino: nombreLugar
            });
          }
        } else {
          const coordenadas = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          const mensaje = tipo === 'inicio' 
            ? `Punto de inicio seleccionado en coordenadas ${coordenadas}`
            : `Destino seleccionado en coordenadas ${coordenadas}`;
          
          this.mensajeVoz = mensaje;
          
          this.textToSpeech.speak(mensaje)
            .then(() => {
              this.reproduciendo = false;
              this.mensajeVoz = '';
            })
            .catch(error => {
              console.error('Error al reproducir mensaje de voz:', error);
              this.reproduciendo = false;
              this.mensajeVoz = '';
            });
        }
      },
      error: (error) => {
        console.error('Error al obtener la dirección:', error);
        const coordenadas = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        const mensaje = tipo === 'inicio' 
          ? `Punto de inicio seleccionado en coordenadas ${coordenadas}`
          : `Destino seleccionado en coordenadas ${coordenadas}`;
        
        this.mensajeVoz = mensaje;
        
        this.textToSpeech.speak(mensaje)
          .then(() => {
            this.reproduciendo = false;
            this.mensajeVoz = '';
          })
          .catch(error => {
            console.error('Error al reproducir mensaje de voz:', error);
            this.reproduciendo = false;
            this.mensajeVoz = '';
          });
      }
    });
  }
}
