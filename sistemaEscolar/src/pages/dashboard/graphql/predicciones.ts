// ============================================
// ARCHIVO: predicciones.ts
// Módulo: Predicciones (Transformada de Laplace)
// Descripción: Consultas GraphQL para predicciones del sistema escolar.
// Basado en el resolver SistemaEscolarResolver.
// ============================================

/**
 * Predice la tasa de asistencia para el próximo mes.
 * @param {Int} mesesHistorico - Número de meses históricos a considerar (default: 8).
 * @param {Float} factorS - Factor de suavizado (default: 0.10). Relación con alpha: α = exp(-s).
 */
export const PREDICCION_ASISTENCIA = `
  query PrediccionAsistencia($mesesHistorico: Int, $factorS: Float) {
    prediccionAsistenciaProximoMes(mesesHistorico: $mesesHistorico, factorS: $factorS) {
      mes_predicho
      tasa_asistencia_predicha
      faltas_predichas
      factor_alpha
      varianza_historica
      confianza_pct
      meses_analizados
    }
  }
`;

/**
 * Predice calificaciones para el próximo período, incluyendo riesgo de reprobación.
 * @param {Float} factorS - Factor de suavizado (default: 0.20). α ≈ 0.819.
 * @param {Boolean} soloRiesgo - Si true, devuelve solo materias con riesgo >20%.
 */
export const PREDICCION_CALIFICACIONES = `
  query PrediccionCalificaciones($factorS: Float, $soloRiesgo: Boolean) {
    prediccionCalificacionProximoPeriodo(factorS: $factorS, soloRiesgo: $soloRiesgo) {
      periodo_predicho
      materia
      promedio_predicho
      factor_alpha
      riesgo_reprobacion_pct
      tendencia
      confianza_pct
    }
  }
`;

/**
 * Predice la demanda de grupos para el siguiente ciclo escolar.
 * @param {Float} factorS - Factor de suavizado (default: 0.12). α ≈ 0.887.
 */
export const PREDICCION_DEMANDA_GRUPOS = `
  query PrediccionDemandaGrupos($factorS: Float) {
    prediccionDemandaGruposSiguienteCiclo(factorS: $factorS) {
      ciclo_predicho
      nivel
      grupos_necesarios
      alumnos_esperados
      factor_alpha
      crecimiento_pct
      confianza_pct
    }
  }
`;

/**
 * Predice retardos de empleados por departamento.
 * @param {Int} mesesHistorico - Número de meses históricos (default: 6).
 * @param {Float} factorS - Factor de suavizado (default: 0.22). α ≈ 0.803.
 */
export const PREDICCION_RETARDOS = `
  query PrediccionRetardos($mesesHistorico: Int, $factorS: Float) {
    prediccionRetardosEmpleados(mesesHistorico: $mesesHistorico, factorS: $factorS) {
      mes_predicho
      departamento
      retardos_esperados
      empleados_en_riesgo
      factor_alpha
      tendencia
      confianza_pct
    }
  }
`;

/**
 * Predice el consumo del comedor con ajuste estacional.
 * @param {Int} semanasHistorico - Número de semanas históricas (default: 8).
 * @param {Float} factorS - Factor de suavizado (default: 0.17). α ≈ 0.844.
 */
export const PREDICCION_CONSUMO_COMEDOR = `
  query PrediccionConsumoComedor($semanasHistorico: Int, $factorS: Float) {
    prediccionConsumoComedor(semanasHistorico: $semanasHistorico, factorS: $factorS) {
      semana_predicha
      consumos_esperados
      ingreso_comedor_estimado
      factor_alpha
      variacion_estacional
      confianza_pct
      semanas_analizadas
    }
  }
`;
