import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { ReportesService } from '../../services/reportes.service';
import { ReporteGeneral } from '../../models/reportes';

Chart.register(...registerables);

@Component({
  selector: 'app-reportes',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartActividad', { static: false }) chartActividad!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartIncidentes', { static: false }) chartIncidentes!: ElementRef<HTMLCanvasElement>;

  reporteData: ReporteGeneral = new ReporteGeneral();
  loading: boolean = true;
  error: string = '';

  private chartActividadInstance: Chart | null = null;
  private chartIncidentesInstance: Chart | null = null;

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    this.cargarReporte();
  }

  ngAfterViewInit(): void {
  }

  cargarReporte(): void {
    this.loading = true;
    this.error = '';
    
    this.reportesService.getReporteGeneral().subscribe({
      next: (data) => {
        this.reporteData = data;
        this.loading = false;
        setTimeout(() => {
          this.crearGraficos();
        }, 100);
      },
      error: (err) => {
        this.error = 'Error al cargar los reportes. Por favor, intente nuevamente.';
        this.loading = false;
        console.error('Error al cargar reportes:', err);
      }
    });
  }

  private crearGraficos(): void {
    this.crearGraficoActividad();
    this.crearGraficoIncidentes();
  }

  private crearGraficoActividad(): void {
    if (this.chartActividadInstance) {
      this.chartActividadInstance.destroy();
    }

    const ctx = this.chartActividad.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: this.reporteData.actividadUsuariosPorMes.map(item => item.label),
        datasets: [{
          label: 'Usuarios Activos por Mes',
          data: this.reporteData.actividadUsuariosPorMes.map(item => item.value),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#ffffff',
              font: {
                size: 12
              }
            }
          },
          title: {
            display: true,
            text: 'Actividad de Usuarios por Mes',
            color: '#ffffff',
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255,255,255,0.1)'
            },
            ticks: {
              color: '#ffffff'
            },
            title: {
              display: true,
              text: 'Usuarios',
              color: '#ffffff'
            }
          },
          x: {
            grid: {
              color: 'rgba(255,255,255,0.1)'
            },
            ticks: {
              color: '#ffffff'
            },
            title: {
              display: true,
              text: 'Mes',
              color: '#ffffff'
            }
          }
        }
      }
    };

    this.chartActividadInstance = new Chart(ctx, config);
  }

  private crearGraficoIncidentes(): void {
    if (this.chartIncidentesInstance) {
      this.chartIncidentesInstance.destroy();
    }

    const ctx = this.chartIncidentes.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: this.reporteData.incidentesPorTipo.map(item => item.label),
        datasets: [{
          data: this.reporteData.incidentesPorTipo.map(item => item.value),
          backgroundColor: this.reporteData.incidentesPorTipo.map(item => item.backgroundColor),
          borderColor: this.reporteData.incidentesPorTipo.map(item => item.borderColor),
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              color: '#ffffff',
              font: {
                size: 12
              }
            }
          },
          title: {
            display: true,
            text: 'Distribución de Incidentes por Tipo',
            color: '#ffffff',
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          tooltip: {
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            backgroundColor: 'rgba(0,0,0,0.8)'
          }
        }
      }
    };

    this.chartIncidentesInstance = new Chart(ctx, config);
  }

  ngOnDestroy(): void {
    if (this.chartActividadInstance) {
      this.chartActividadInstance.destroy();
    }
    if (this.chartIncidentesInstance) {
      this.chartIncidentesInstance.destroy();
    }
  }
}
