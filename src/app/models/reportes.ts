export class ResumenTextual {
  totalUsuarios: number = 0;
  totalRutas: number = 0;
  totalIncidentes: number = 0;
  totalPasos: number = 0;
  totalCalorias: number = 0;
  promedioTemperatura: number = 0;
  rutaMasUsada: string = '';
  tipoIncidenteMasFrecuente: string = '';
  totalMetricas: number = 0;
}

export class DatoGrafico {
  label: string = '';
  value: number = 0;
  backgroundColor: string = '';
  borderColor: string = '';
}

export class ReporteGeneral {
  resumenTextual: ResumenTextual = new ResumenTextual();
  actividadUsuariosPorMes: DatoGrafico[] = [];
  incidentesPorTipo: DatoGrafico[] = [];
}
