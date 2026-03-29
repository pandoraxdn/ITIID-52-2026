// ================================================================
// sistema-escolar.resolver.ts
// ================================================================
// ¿Qué es un Resolver en NestJS + GraphQL?
// Piensa en el Resolver como si fuera el mesero de un restaurante.
// Él toma tu pedido (la consulta GraphQL), verifica que esté bien 
// estructurado, y luego se lo pasa a la cocina (el Servicio) para 
// que prepare los datos. Al final, el Resolver te sirve el plato.
//
// El resolver NO contiene lógica de base de datos. Solo delega
// al servicio (sistema-escolar.service.ts).
//
// ¿Qué son los @ObjectType() y @Field()?
// GraphQL es un lenguaje de consultas tipado. Necesita saber 
// EXACTAMENTE qué campos tiene cada respuesta para construir su esquema.
// @ObjectType() define la "forma" de los datos que devuelve.
// @Field() marca cada propiedad que el cliente (Frontend/App) 
// tiene permitido solicitar.
//
// REGLA DE ORO EN TYPESCRIPT Y GRAPHQL:
// Los tipos deben declararse ANTES de ser usados si están en el mismo 
// archivo. Por ejemplo, si un Grupo tiene una Materia, debes declarar 
// MateriaType antes que GrupoType.
// ================================================================

import {Query, Resolver, ObjectType, Field, Float, Int, Args, ID} from '@nestjs/graphql';
import {SistemaEscolarService} from './sistema-escolar.service';

// ================================================================
//  TIPOS BASE
//  Estos tipos representan una sola tabla, sin joins ni cruces 
//  complejos. Son la base para armar respuestas más grandes.
// ================================================================

@ObjectType()
export class CicloType {
  // ID es un tipo especial en GraphQL, indica que es un identificador único
  @Field(() => ID)      id_ciclo:     number;
  @Field()              nombre:       string;
  @Field()              fecha_inicio: string;
  @Field()              fecha_fin:    string;
  @Field(() => Boolean) activo:       boolean; // Booleano: verdadero/falso
}

@ObjectType()
export class PeriodoType {
  @Field(() => ID)  id_periodo:   number;
  @Field()          nombre:       string;
  @Field()          tipo:         string;
  @Field()          fecha_inicio: string;
  @Field()          fecha_fin:    string;
  @Field(() => Int) ciclo_id:     number; // Int para enteros numéricos
}

@ObjectType()
export class MateriaType {
  @Field(() => ID)  id_materia:    number;
  @Field()          clave_oficial: string;
  @Field()          nombre:        string;
  @Field(() => Int) creditos:      number;
  @Field()          tipo:          string;
  @Field()          descripcion:   string;
}

@ObjectType()
export class EmpleadoType {
  @Field(() => ID)      id_empleado:         number;
  @Field()              numero_empleado:     string;
  @Field()              nombre:              string;
  @Field()              apellido_p:          string;
  @Field()              apellido_m:          string;
  @Field()              email_institucional: string;
  @Field()              telefono:            string;
  @Field()              tipo_empleado:       string;
  @Field()              puesto:              string;
  @Field()              departamento:        string;
  @Field()              fecha_contratacion:  string;
  @Field(() => Boolean) activo:              boolean;
}

@ObjectType()
export class ConceptoPagoType {
  @Field(() => ID)      id_concepto:   number;
  @Field()              nombre:        string;
  @Field(() => Float)   monto:         number; // Float para decimales (ej. dinero)
  @Field(() => Boolean) es_recurrente: boolean;
}

@ObjectType()
export class MenuComedorType {
  @Field(() => ID)    id_menu:     number;
  @Field()            fecha:       string;
  @Field()            titulo:      string;
  @Field()            descripcion: string;
  @Field(() => Float) costo:       number;
}

@ObjectType()
export class JornadaLaboralType {
  @Field(() => ID)  id_jornada:         number;
  @Field()          dia_semana:         string;
  @Field()          horaEntrada:        string;
  @Field()          horaSalida:         string;
  @Field(() => Int) tolerancia_minutos: number;
}

@ObjectType()
export class AsistenciaEmpleadoType {
  @Field(() => ID)  id_asistencia_emp: number;
  @Field()          fecha:             string;
  @Field()          hora_entrada_real: string;
  @Field()          hora_salida_real:  string;
  @Field()          estado_asistencia: string;
  @Field(() => Int) minutos_retardo:   number;
  @Field()          observaciones:     string;
}

// ================================================================
//  TIPOS CON RELACIONES (JOINS)
//  Estos tipos "anidan" otros tipos dentro de sí mismos. 
//  Permiten al Frontend pedir, por ejemplo, los datos del profesor 
//  Y a su vez, los datos del empleado asociado.
// ================================================================

@ObjectType()
export class ProfesorType {
  @Field(() => ID)  id_profesor:        number;
  @Field(() => Int) empleado_id:        number;
  @Field()          especialidad:       string;
  @Field()          nivel_estudios:     string;
  @Field()          cedula_profesional: string;
  // {nullable: true} significa que este dato es opcional.
  // Si el frontend no lo pide, o si la BD no lo encuentra, devuelve nulo sin arrojar error.
  @Field(() => EmpleadoType, {nullable: true}) empleado?: EmpleadoType;
}

@ObjectType()
export class GrupoType {
  @Field(() => ID)  id_grupo:    number;
  @Field()          nombre:      string;
  @Field()          grupo:       string;
  @Field()          turno:       string;
  @Field()          nivel:       string;
  @Field(() => Int) cupo_maximo: number;
  @Field()          aula:        string;
  @Field(() => Int) ciclo_id:    number;
  @Field(() => CicloType, {nullable: true}) ciclo?: CicloType;
}

@ObjectType()
export class DetGrupoMateriaType {
  @Field(() => ID)  id_det_grupo_materia: number;
  @Field(() => Int) grupo_id:             number;
  @Field(() => Int) materia_id:           number;
  @Field(() => Int) profesor_id:          number;
  @Field({nullable: true}) salon_asignado?: string;
  @Field(() => GrupoType,    {nullable: true}) grupo?:    GrupoType;
  @Field(() => MateriaType,  {nullable: true}) materia?:  MateriaType;
  @Field(() => ProfesorType, {nullable: true}) profesor?: ProfesorType;
}

@ObjectType()
export class AlumnoType {
  @Field(() => ID)      id_alumno:           number;
  @Field()              matricula:           string;
  @Field()              nombre:              string;
  @Field()              apellido_p:          string;
  @Field()              apellido_m:          string;
  @Field()              genero:              string;
  @Field()              email_institucional: string;
  @Field()              tipo_sangre:         string;
  @Field()              fecha_ingreso:       string;
  @Field(() => Boolean) activo:              boolean;
}

@ObjectType()
export class InscripcionType {
  @Field(() => ID)    id_inscripcion:    number;
  @Field(() => Int)   alumno_id:         number;
  @Field(() => Int)   grupo_id:          number;
  @Field(() => Int)   ciclo_id:          number;
  @Field()            fecha_inscripcion: string;
  @Field(() => Float) beca_porcentaje:   number;
  @Field(() => AlumnoType, {nullable: true}) alumno?: AlumnoType;
  @Field(() => GrupoType,  {nullable: true}) grupo?:  GrupoType;
  @Field(() => CicloType,  {nullable: true}) ciclo?:  CicloType;
}

@ObjectType()
export class PagoType {
  @Field(() => ID)    id_pago:      number;
  @Field(() => Int)   alumno_id:    number;
  @Field(() => Int)   concepto_id:  number;
  @Field(() => Float) monto_pagado: number;
  @Field()            fecha_pago:   string;
  @Field()            metodo_pago:  string;
  @Field()            estado:       string;
  @Field({nullable: true}) referencia_bancaria?: string;
  @Field(() => AlumnoType,       {nullable: true}) alumno?:   AlumnoType;
  @Field(() => ConceptoPagoType, {nullable: true}) concepto?: ConceptoPagoType;
}

@ObjectType()
export class ConsumoComedorOutputType {
  @Field(() => ID)  id_consumo:    number;
  @Field(() => Int) alumno_id:     number;
  @Field()          fecha:         string;
  @Field()          tipo_consumo:  string;
  @Field()          observaciones: string;
  @Field(() => AlumnoType,      {nullable: true}) alumno?: AlumnoType;
  @Field(() => MenuComedorType, {nullable: true}) menu?:   MenuComedorType;
}

@ObjectType()
export class CalificacionType {
  @Field(() => ID)    id_calificacion:      number;
  @Field(() => Int)   inscripcion_id:       number;
  @Field(() => Int)   det_grupo_materia_id: number;
  @Field(() => Int)   periodo_id:           number;
  @Field(() => Float) valor:                number;
  @Field(() => Int)   faltas_periodo:       number;
  @Field()            observaciones:        string;
  @Field(() => InscripcionType,     {nullable: true}) inscripcion?:     InscripcionType;
  @Field(() => DetGrupoMateriaType, {nullable: true}) detGrupoMateria?: DetGrupoMateriaType;
  @Field(() => PeriodoType,         {nullable: true}) periodo?:         PeriodoType;
}

@ObjectType()
export class AsistenciaAlumnoType {
  @Field(() => ID)  id_asistencia_al:     number;
  @Field(() => Int) inscripcion_id:       number;
  @Field(() => Int) det_grupo_materia_id: number;
  @Field()          fecha:                string;
  @Field()          estado_asistencia:    string;
  @Field()          observaciones:        string;
  @Field(() => InscripcionType,     {nullable: true}) inscripcion?:     InscripcionType;
  @Field(() => DetGrupoMateriaType, {nullable: true}) detGrupoMateria?: DetGrupoMateriaType;
}

// ================================================================
//  TIPOS COMPUESTOS PARA QUERIES COMPLEJAS
//  Vistas especiales que combinan múltiples tablas.
// ================================================================

@ObjectType()
export class AlumnoConInscripcionType {
  @Field(() => ID)      id_alumno:  number;
  @Field()              matricula:  string;
  @Field()              nombre:     string;
  @Field()              apellido_p: string;
  @Field()              apellido_m: string;
  @Field()              genero:     string;
  @Field(() => Boolean) activo:     boolean;
  // Observa los corchetes []. Esto indica que devuelve un Array (lista) de inscripciones.
  @Field(() => [InscripcionType], {nullable: true}) inscripciones?: InscripcionType[];
}

@ObjectType()
export class ProfesorConCargaType {
  @Field(() => ID)  id_profesor:        number;
  @Field(() => Int) empleado_id:        number;
  @Field()          especialidad:       string;
  @Field()          nivel_estudios:     string;
  @Field()          cedula_profesional: string;
  @Field(() => EmpleadoType, {nullable: true}) empleado?: EmpleadoType;
  @Field(() => [DetGrupoMateriaType], {nullable: true}) detGruposMaterias?: DetGrupoMateriaType[];
}

@ObjectType()
export class GrupoConDetalleType {
  @Field(() => ID)  id_grupo:    number;
  @Field()          nombre:      string;
  @Field()          turno:       string;
  @Field()          nivel:       string;
  @Field(() => Int) cupo_maximo: number;
  @Field()          aula:        string;
  @Field(() => CicloType, {nullable: true}) ciclo?: CicloType;
  @Field(() => [InscripcionType],     {nullable: true}) inscripciones?:    InscripcionType[];
  @Field(() => [DetGrupoMateriaType], {nullable: true}) detGruposMaterias?: DetGrupoMateriaType[];
}

@ObjectType()
export class InscripcionConExpedienteType {
  @Field(() => ID)    id_inscripcion:    number;
  @Field()            fecha_inscripcion: string;
  @Field(() => Float) beca_porcentaje:   number;
  @Field(() => AlumnoType, {nullable: true}) alumno?: AlumnoType;
  @Field(() => GrupoType,  {nullable: true}) grupo?:  GrupoType;
  @Field(() => [CalificacionType], {nullable: true}) calificaciones?: CalificacionType[];
}

@ObjectType()
export class MateriaConAsignacionType {
  @Field(() => ID)  id_materia:    number;
  @Field()          clave_oficial: string;
  @Field()          nombre:        string;
  @Field(() => Int) creditos:      number;
  @Field()          tipo:          string;
  @Field(() => [DetGrupoMateriaType], {nullable: true}) detGruposMaterias?: DetGrupoMateriaType[];
}

@ObjectType()
export class CicloConGruposType {
  @Field(() => ID)      id_ciclo:     number;
  @Field()              nombre:       string;
  @Field()              fecha_inicio: string;
  @Field()              fecha_fin:    string;
  @Field(() => Boolean) activo:       boolean;
  @Field(() => [GrupoType],   {nullable: true}) grupos?:   GrupoType[];
  @Field(() => [PeriodoType], {nullable: true}) periodos?: PeriodoType[];
}

@ObjectType()
export class EmpleadoConAsistenciaType {
  @Field(() => ID)      id_empleado:   number;
  @Field()              nombre:        string;
  @Field()              apellido_p:    string;
  @Field()              apellido_m:    string;
  @Field()              tipo_empleado: string;
  @Field()              puesto:        string;
  @Field()              departamento:  string;
  @Field(() => Boolean) activo:        boolean;
  @Field(() => [AsistenciaEmpleadoType], {nullable: true}) asistencias?: AsistenciaEmpleadoType[];
  @Field(() => [JornadaLaboralType],     {nullable: true}) jornadas?:    JornadaLaboralType[];
  @Field(() => ProfesorType,             {nullable: true}) profesor?:    ProfesorType;
}

// ================================================================
//  TIPOS PARA QUERIES AGREGADAS
//  (Resultados de agrupaciones y operaciones matemáticas en SQL)
// ================================================================

@ObjectType()
export class ResumenAlumnosType {
  @Field(() => Int) total:     number;
  @Field(() => Int) activos:   number;
  @Field(() => Int) inactivos: number;
  @Field(() => Int) masculino: number;
  @Field(() => Int) femenino:  number;
}

@ObjectType()
export class PromedioMateriaType {
  @Field()            materia:    string;
  @Field()            tipo:       string;
  @Field(() => Float) promedio:   number;
  @Field(() => Int)   total:      number;
  @Field(() => Int)   aprobados:  number;
  @Field(() => Int)   reprobados: number;
}

@ObjectType()
export class AlumnosPorNivelType {
  @Field()          nivel: string;
  @Field(() => Int) total: number;
}

@ObjectType()
export class PagoMesType {
  @Field()            mes:               string;
  @Field(() => Float) pagado:            number;
  @Field(() => Float) pendiente:         number;
  @Field(() => Int)   total_operaciones: number;
}

@ObjectType()
export class AsistenciaMesType {
  @Field()            mes:         string;
  @Field(() => Int)   total:       number;
  @Field(() => Int)   asistencias: number;
  @Field(() => Int)   faltas:      number;
  @Field(() => Int)   retardos:    number;
  @Field(() => Float) tasa_pct:    number;
}

@ObjectType()
export class PagoMetodoType {
  @Field()            metodo: string;
  @Field(() => Int)   total:  number;
  @Field(() => Float) monto:  number;
}

@ObjectType()
export class RendimientoNivelType {
  @Field()            nivel:      string;
  @Field()            turno:      string;
  @Field(() => Float) promedio:   number;
  @Field(() => Int)   alumnos:    number;
  @Field(() => Int)   aprobados:  number;
  @Field(() => Int)   reprobados: number;
}

@ObjectType()
export class AlumnoFaltasType {
  @Field()            matricula:         string;
  @Field()            alumno:            string;
  @Field()            nivel:             string;
  @Field(() => Float) promedio:          number;
  @Field(() => Int)   total_faltas:      number;
  @Field(() => Int)   materias_cursadas: number;
}

@ObjectType()
export class KpisDashboardType {
  @Field(() => Int)   alumnos_total:         number;
  @Field(() => Int)   alumnos_activos:       number;
  @Field(() => Int)   pagos_total:           number;
  @Field(() => Int)   pagos_completados:     number;
  @Field(() => Float) monto_cobrado:         number;
  @Field(() => Float) monto_pendiente:       number;
  @Field(() => Float) promedio_calificacion: number;
  @Field(() => Int)   aprobados:             number;
  @Field(() => Int)   reprobados:            number;
  @Field(() => Float) tasa_asistencia_pct:   number;
  @Field(() => Int)   total_grupos:          number;
  @Field(() => Float) pct_ocupacion_grupos:  number;
}

// ================================================================
//  TIPOS DE PREDICCIÓN (Transformada de Laplace)
// ================================================================

@ObjectType()
export class PrediccionAsistenciaType {
  @Field()            mes_predicho:             string;
  @Field(() => Float) tasa_asistencia_predicha: number;
  @Field(() => Float) faltas_predichas:         number;
  @Field(() => Float) factor_alpha:             number;
  @Field(() => Float) varianza_historica:       number;
  @Field(() => Float) confianza_pct:            number;
  @Field(() => Int)   meses_analizados:         number;
}

@ObjectType()
export class PrediccionCalificacionType {
  @Field()            periodo_predicho:       string;
  @Field()            materia:                string;
  @Field(() => Float) promedio_predicho:      number;
  @Field(() => Float) factor_alpha:           number;
  @Field(() => Float) riesgo_reprobacion_pct: number;
  @Field(() => Float) tendencia:              number;
  @Field(() => Float) confianza_pct:          number;
}

@ObjectType()
export class PrediccionDemandaGrupoType {
  @Field()            ciclo_predicho:    string;
  @Field()            nivel:             string;
  @Field(() => Int)   grupos_necesarios: number;
  @Field(() => Int)   alumnos_esperados: number;
  @Field(() => Float) factor_alpha:      number;
  @Field(() => Float) crecimiento_pct:   number;
  @Field(() => Float) confianza_pct:     number;
}

@ObjectType()
export class PrediccionRetardosEmpleadoType {
  @Field()            mes_predicho:        string;
  @Field()            departamento:        string;
  @Field(() => Float) retardos_esperados:  number;
  @Field(() => Float) empleados_en_riesgo: number;
  @Field(() => Float) factor_alpha:        number;
  @Field(() => Float) tendencia:           number;
  @Field(() => Float) confianza_pct:       number;
}

@ObjectType()
export class PrediccionConsumoComedorType {
  @Field()            semana_predicha:          string;
  @Field(() => Float) consumos_esperados:       number;
  @Field(() => Float) ingreso_comedor_estimado: number;
  @Field(() => Float) factor_alpha:             number;
  @Field(() => Float) variacion_estacional:     number;
  @Field(() => Float) confianza_pct:            number;
  @Field(() => Int)   semanas_analizadas:       number;
}

// ================================================================
//  RESOLVER - CLASE PRINCIPAL
// ================================================================

// El decorador @Resolver le dice a NestJS que esta clase 
// manejará las consultas de GraphQL.
@Resolver()
export class SistemaEscolarResolver {

  // Inyectamos el servicio en el constructor.
  // readonly asegura que no podamos reemplazar accidentalmente 
  // la instancia del servicio en otro lugar del código.
  constructor(private readonly service: SistemaEscolarService) {}

  // @Query define el nombre del endpoint. El cliente preguntará por 'hello'.
  @Query(() => String, {name: 'hello'})
  helloWorld() { return 'Sistema Escolar Pandora — OK'; }

  // ==============================================================
  //  QUERIES DE DATOS
  //  Aquí delegamos cada consulta al servicio.
  // ==============================================================

  @Query(() => [AlumnoConInscripcionType], {name: 'alumnosConInscripcionActiva'})
  alumnosConInscripcionActiva() {
    return this.service.alumnosConInscripcionActiva();
  }

  // @Args define los argumentos que el cliente puede enviar en la consulta.
  // defaultValue provee un valor por defecto si el cliente no lo envía.
  @Query(() => [CalificacionType], {name: 'calificacionesConDetalle'})
  calificacionesConDetalle(
    @Args('limit', {type: () => Int, defaultValue: 100}) limit: number,
  ) { return this.service.calificacionesConDetalle(limit); }

  @Query(() => [ProfesorConCargaType], {name: 'profesoresConCargaAcademica'})
  profesoresConCargaAcademica(
    @Args('limit', {type: () => Int, defaultValue: 20}) limit: number,
  ) { return this.service.profesoresConCargaAcademica(limit); }

  // nullable: true indica que el parámetro 'nivel' es completamente opcional.
  @Query(() => [GrupoConDetalleType], {name: 'gruposConDetalle'})
  gruposConDetalle(
    @Args('nivel', {type: () => String, nullable: true}) nivel?: string,
  ) { return this.service.gruposConDetalle(nivel); }

  @Query(() => [PagoType], {name: 'pagosConDetalle'})
  pagosConDetalle(
    @Args('estado', {type: () => String, nullable: true}) estado?: string,
    @Args('limit',  {type: () => Int, defaultValue: 50})  limit = 50,
  ) { return this.service.pagosConDetalle(estado, limit); }

  @Query(() => [InscripcionConExpedienteType], {name: 'inscripcionesConExpediente'})
  inscripcionesConExpediente(
    @Args('cicloActivo', {type: () => Boolean, defaultValue: true}) cicloActivo: boolean,
  ) { return this.service.inscripcionesConExpediente(cicloActivo); }

  @Query(() => [MateriaConAsignacionType], {name: 'materiasConAsignaciones'})
  materiasConAsignaciones(
    @Args('tipo', {type: () => String, nullable: true}) tipo?: string,
  ) { return this.service.materiasConAsignaciones(tipo); }

  @Query(() => [CicloConGruposType], {name: 'ciclosConGruposYPeriodos'})
  ciclosConGruposYPeriodos() {
    return this.service.ciclosConGruposYPeriodos();
  }

  @Query(() => [ConsumoComedorOutputType], {name: 'consumosComedorConDetalle'})
  consumosComedorConDetalle(
    @Args('limit', {type: () => Int, defaultValue: 50}) limit: number,
  ) { return this.service.consumosComedorConDetalle(limit); }

  @Query(() => [AsistenciaAlumnoType], {name: 'asistenciasAlumnosConDetalle'})
  asistenciasAlumnosConDetalle(
    @Args('limit', {type: () => Int, defaultValue: 100}) limit: number,
  ) { return this.service.asistenciasAlumnosConDetalle(limit); }

  @Query(() => [EmpleadoConAsistenciaType], {name: 'empleadosConAsistenciasYJornadas'})
  empleadosConAsistenciasYJornadas(
    @Args('limit', {type: () => Int, defaultValue: 30}) limit: number,
  ) { return this.service.empleadosConAsistenciasYJornadas(limit); }

  @Query(() => ResumenAlumnosType, {name: 'resumenAlumnos'})
  resumenAlumnos() { return this.service.resumenAlumnos(); }

  @Query(() => [PromedioMateriaType], {name: 'promedioCalificacionesPorMateria'})
  promedioCalificacionesPorMateria(
    @Args('limit', {type: () => Int, defaultValue: 10}) limit: number,
  ) { return this.service.promedioCalificacionesPorMateria(limit); }

  @Query(() => [AlumnosPorNivelType], {name: 'alumnosPorNivel'})
  alumnosPorNivel() { return this.service.alumnosPorNivel(); }

  @Query(() => [PagoMesType], {name: 'pagosPorMes'})
  pagosPorMes(
    @Args('meses', {type: () => Int, defaultValue: 8}) meses: number,
  ) { return this.service.pagosPorMes(meses); }

  @Query(() => [AsistenciaMesType], {name: 'asistenciaMensualAlumnos'})
  asistenciaMensualAlumnos(
    @Args('meses', {type: () => Int, defaultValue: 8}) meses: number,
  ) { return this.service.asistenciaMensualAlumnos(meses); }

  @Query(() => [PagoMetodoType], {name: 'pagosPorMetodo'})
  pagosPorMetodo() { return this.service.pagosPorMetodo(); }

  @Query(() => [RendimientoNivelType], {name: 'rendimientoPorNivel'})
  rendimientoPorNivel() { return this.service.rendimientoPorNivel(); }

  @Query(() => [AlumnoFaltasType], {name: 'alumnosConMasFaltas'})
  alumnosConMasFaltas(
    @Args('limit', {type: () => Int, defaultValue: 10}) limit: number,
  ) { return this.service.alumnosConMasFaltas(limit); }

  @Query(() => KpisDashboardType, {name: 'kpisDashboard'})
  kpisDashboard() { return this.service.kpisDashboard(); }

  // ==============================================================
  //  QUERIES DE PREDICCIÓN RESTANTES
  // ==============================================================

  @Query(() => PrediccionAsistenciaType, {name: 'prediccionAsistenciaProximoMes',
    description: 'Predice la tasa de asistencia mensual. s=0.10 → α≈0.905 (señal estable).'})
  prediccionAsistenciaProximoMes(
    @Args('mesesHistorico', {type: () => Int,   defaultValue: 8})    mesesHistorico: number,
    @Args('factorS',        {type: () => Float, defaultValue: 0.10}) factorS: number,
  ) { return this.service.prediccionAsistenciaProximoMes(mesesHistorico, factorS); }

  @Query(() => [PrediccionCalificacionType], {name: 'prediccionCalificacionProximoPeriodo',
    description: 'Predice el promedio por materia e identifica riesgo de reprobación. s=0.20 → α≈0.819.'})
  prediccionCalificacionProximoPeriodo(
    @Args('factorS',    {type: () => Float,   defaultValue: 0.20})  factorS: number,
    @Args('soloRiesgo', {type: () => Boolean, defaultValue: false,
      description: 'Si true, devuelve solo las materias con riesgo de reprobación > 20%.'})
    soloRiesgo: boolean,
  ) { return this.service.prediccionCalificacionProximoPeriodo(factorS, soloRiesgo); }

  @Query(() => [PrediccionDemandaGrupoType], {name: 'prediccionDemandaGruposSiguienteCiclo',
    description: 'Predice grupos y alumnos por nivel en el siguiente ciclo. s=0.12 → α≈0.887 (señal lenta).'})
  prediccionDemandaGruposSiguienteCiclo(
    @Args('factorS', {type: () => Float, defaultValue: 0.12}) factorS: number,
  ) { return this.service.prediccionDemandaGruposSiguienteCiclo(factorS); }

  @Query(() => [PrediccionRetardosEmpleadoType], {name: 'prediccionRetardosEmpleados',
    description: 'Predice retardos y empleados en riesgo por departamento. s=0.22 → α≈0.803 (señal volátil).'})
  prediccionRetardosEmpleados(
    @Args('mesesHistorico', {type: () => Int,   defaultValue: 6})    mesesHistorico: number,
    @Args('factorS',        {type: () => Float, defaultValue: 0.22}) factorS: number,
  ) { return this.service.prediccionRetardosEmpleados(mesesHistorico, factorS); }

  @Query(() => PrediccionConsumoComedorType, {name: 'prediccionConsumoComedor',
    description: 'Predice consumos del comedor con ajuste estacional. s=0.17 → α≈0.844.'})
  prediccionConsumoComedor(
    @Args('semanasHistorico', {type: () => Int,   defaultValue: 8})    semanasHistorico: number,
    @Args('factorS',          {type: () => Float, defaultValue: 0.17}) factorS: number,
  ) { return this.service.prediccionConsumoComedor(semanasHistorico, factorS); }

}
