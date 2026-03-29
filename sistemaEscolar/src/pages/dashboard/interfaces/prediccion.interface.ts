// ============================================
// ARCHIVO: prediccion.interface.ts
// Módulo: Predicciones
// Descripción: Tipos e interfaces para respuestas de predicción.
// ============================================

export interface PrediccionAsistencia {
  mes_predicho: string;
  tasa_asistencia_predicha: number;
  faltas_predichas: number;
  factor_alpha: number;
  varianza_historica: number;
  confianza_pct: number;
  meses_analizados: number;
}

export interface PrediccionCalificacion {
  periodo_predicho: string;
  materia: string;
  promedio_predicho: number;
  factor_alpha: number;
  riesgo_reprobacion_pct: number;
  tendencia: number;
  confianza_pct: number;
}

export interface PrediccionDemandaGrupo {
  ciclo_predicho: string;
  nivel: string;
  grupos_necesarios: number;
  alumnos_esperados: number;
  factor_alpha: number;
  crecimiento_pct: number;
  confianza_pct: number;
}

export interface PrediccionRetardo {
  mes_predicho: string;
  departamento: string;
  retardos_esperados: number;
  empleados_en_riesgo: number;
  factor_alpha: number;
  tendencia: number;
  confianza_pct: number;
}

export interface PrediccionConsumoComedor {
  semana_predicha: string;
  consumos_esperados: number;
  ingreso_comedor_estimado: number;
  factor_alpha: number;
  variacion_estacional: number;
  confianza_pct: number;
  semanas_analizadas: number;
}
