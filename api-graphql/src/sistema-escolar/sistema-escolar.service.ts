// ================================================================
// sistema-escolar.service.ts
// ================================================================
// ¿Qué es un "Service" (Servicio) en NestJS?
// En la arquitectura de software, el Servicio es el cerebro de la 
// aplicación. Aquí vive la "Lógica de Negocio". 
// El resolver (que veremos en el otro archivo) solo recibe peticiones, 
// pero es el Servicio quien hace el trabajo duro: consultar la base 
// de datos, hacer cálculos matemáticos y devolver la información.
// ================================================================

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Importación de entidades
// Las entidades son clases que representan tablas en la base de datos.
import { Alumno } from './entities/alumnos/alumno.entity';
import { Inscripcion } from './entities/inscripciones/inscripcion.entity';
import { Calificacion } from './entities/calificaciones/calificacion.entity';
import { Pago } from './entities/pagos/pago.entity';
import { Grupo } from './entities/grupos/grupo.entity';
import { Materia } from './entities/materias/materia.entity';
import { Profesor } from './entities/profesores/profesor.entity';
import { Empleado } from './entities/empleados/empleado.entity';
import { DetGrupoMateria } from './entities/det-grupos-materias/det-grupo-materia.entity';
import { CicloEscolar } from './entities/ciclos-escolares/ciclo-escolar.entity';
import { ConsumoComedor } from './entities/consumos-comedor/consumo-comedor.entity';
import { AsistenciaAlumno } from './entities/asistencias-alumnos/asistencia-alumnos.entity';
import { AsistenciaEmpleado } from './entities/asistencias-empleados/asistencia-empleado.entity';

// ================================================================
//  FUNCIONES AUXILIARES DE FECHA
//  (Funciones puras de JavaScript para manejar strings de fechas)
// ================================================================

function siguienteMes(mes: string): string {
  const [y, m] = mes.split('-').map(Number);
  const siguiente = new Date(y, m, 1);
  return `${siguiente.getFullYear()}-${String(siguiente.getMonth() + 1).padStart(2, '0')}`;
}

function siguienteSemana(semana: string): string {
  const [y, w] = semana.replace('W', '').split('-').map(Number);
  return w >= 52 ? `${y + 1}-W01` : `${y}-W${String(w + 1).padStart(2, '0')}`;
}

function semanaISO(fecha: Date): string {
  const d = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const inicioAnio = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const numeroDeSemana = Math.ceil(((d.getTime() - inicioAnio.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(numeroDeSemana).padStart(2, '0')}`;
}

// ================================================================
//  TRANSFORMADA DE LAPLACE DISCRETA
//  Esta función matemática toma un historial de datos (serie) y 
//  aplica un suavizado exponencial para predecir el futuro.
// ================================================================

function laplace(serie: number[], s: number) {
  const alpha = Math.exp(-s);
  let F = 0, W = 0;
  serie.forEach((valor, k) => {
    const peso = Math.pow(alpha, k);
    F += valor * peso;
    W += peso;
  });
  const prediccion = W > 0 ? F / W : 0;
  const tendencia = serie.length >= 2
    ? (serie[0] - serie[serie.length - 1]) / (serie.length - 1)
    : 0;
  const media = serie.reduce((acc, val) => acc + val, 0) / (serie.length || 1);
  const varianza = serie.reduce((acc, val) => acc + (val - media) ** 2, 0) / (serie.length || 1);
  const cv = media > 0 ? (Math.sqrt(varianza) / media) * 100 : 100;
  const confianza_pct = parseFloat(Math.max(0, Math.min(100, 100 - cv)).toFixed(1));
  return {
    prediccion: parseFloat(prediccion.toFixed(2)),
    alpha: parseFloat(alpha.toFixed(4)),
    confianza_pct,
    promedio_ponderado: parseFloat(prediccion.toFixed(2)),
    tendencia: parseFloat(tendencia.toFixed(4)),
  };
}

// ================================================================
//  HELPERS SQL REUTILIZABLES (PostgreSQL)
//  Pequeñas ayudas para no repetir código SQL crudo muchas veces.
// ================================================================

const porMes = (campo: string) => `TO_CHAR(${campo}, 'YYYY-MM')`;

const sumaCaso = (cond: string, expr = '1') =>
  `SUM(CASE WHEN ${cond} THEN ${expr} ELSE 0 END)`;

const sumR = (expr: string) => `ROUND(SUM(${expr}), 2)`;

// ================================================================
//  CLASE DEL SERVICIO
// ================================================================

// @Injectable() le dice a NestJS: "Oye, esta clase se puede inyectar
// en otros lugares (como en el Resolver)". Es el patrón de 
// Inyección de Dependencias.
@Injectable()
export class SistemaEscolarService {
  
  // El Constructor: Aquí NestJS nos "inyecta" las herramientas.
  // @InjectRepository le pide a TypeORM que nos dé un "Repository"
  // para cada tabla. Un Repository es como un control remoto que 
  // tiene botones preprogramados para buscar, guardar o borrar datos.
  constructor(
    @InjectRepository(Alumno) private alumnoRepo: Repository<Alumno>,
    @InjectRepository(Inscripcion) private inscripcionRepo: Repository<Inscripcion>,
    @InjectRepository(Calificacion) private calificacionRepo: Repository<Calificacion>,
    @InjectRepository(Pago) private pagoRepo: Repository<Pago>,
    @InjectRepository(Grupo) private grupoRepo: Repository<Grupo>,
    @InjectRepository(Materia) private materiaRepo: Repository<Materia>,
    @InjectRepository(Profesor) private profesorRepo: Repository<Profesor>,
    @InjectRepository(Empleado) private empleadoRepo: Repository<Empleado>,
    @InjectRepository(DetGrupoMateria) private detRepo: Repository<DetGrupoMateria>,
    @InjectRepository(CicloEscolar) private cicloRepo: Repository<CicloEscolar>,
    @InjectRepository(ConsumoComedor) private consumoRepo: Repository<ConsumoComedor>,
    @InjectRepository(AsistenciaAlumno) private asistAlumnoRepo: Repository<AsistenciaAlumno>,
    @InjectRepository(AsistenciaEmpleado) private asistEmpleadoRepo: Repository<AsistenciaEmpleado>,
  ) {}

  // ==============================================================
  //  SECCIÓN 1: CONSULTAS DE DATOS (Stubs / Declaraciones vacías)
  // ==============================================================
  async alumnosConInscripcionActiva() { /* ... */ }
  async calificacionesConDetalle(limit = 100) { /* ... */ }
  async profesoresConCargaAcademica(limit = 20) { /* ... */ }
  async gruposConDetalle(nivel?: string) { /* ... */ }
  async pagosConDetalle(estado?: string, limit = 50) { /* ... */ }
  async inscripcionesConExpediente(cicloActivo = true) { /* ... */ }
  async materiasConAsignaciones(tipo?: string) { /* ... */ }
  async ciclosConGruposYPeriodos() { /* ... */ }
  async consumosComedorConDetalle(limit = 50) { /* ... */ }
  async asistenciasAlumnosConDetalle(limit = 100) { /* ... */ }
  async empleadosConAsistenciasYJornadas(limit = 30) { /* ... */ }
  async resumenAlumnos() { /* ... */ }
  async promedioCalificacionesPorMateria(limit = 10) { /* ... */ }
  async alumnosPorNivel() { /* ... */ }
  async pagosPorMes(meses = 8) { /* ... */ }
  async asistenciaMensualAlumnos(meses = 8) { /* ... */ }
  async pagosPorMetodo() { /* ... */ }
  async rendimientoPorNivel() { /* ... */ }
  async alumnosConMasFaltas(limit = 10) { /* ... */ }
  async kpisDashboard() { /* ... */ }

  // ==============================================================
  //  SECCIÓN 2: PREDICCIONES
  //  Aquí usamos QueryBuilder, una herramienta de TypeORM para 
  //  escribir consultas SQL complejas de forma segura con código.
  // ==============================================================

  async prediccionAsistenciaProximoMes(mesesHistorico = 8, factorS = 0.10) {
    const mes = porMes('aa.fecha');
    
    // createQueryBuilder('aa') inicia una consulta a la tabla asistencias (alias 'aa').
    const rows = await this.asistAlumnoRepo
      .createQueryBuilder('aa')
      .innerJoin('aa.inscripcion', 'ins') // Equivalente a INNER JOIN inscripciones ins ON...
      .innerJoin('ins.grupo', 'g')
      .innerJoin('g.ciclo', 'c')
      .select(mes, 'mes') // Qué columnas queremos traer
      .addSelect('COUNT(*)', 'total')
      .addSelect(sumaCaso("aa.estado_asistencia = 'ASISTENCIA'"), 'asistencias')
      .where('c.activo = :activo', { activo: true }) // Parámetro seguro contra SQL Injection
      .groupBy(mes)
      .orderBy('mes', 'DESC')
      .limit(mesesHistorico)
      .getRawMany(); // getRawMany() devuelve los datos crudos, no objetos Entidad completos

    if (!rows.length) return {
      mes_predicho:             siguienteMes(new Date().toISOString().slice(0, 7)),
      tasa_asistencia_predicha: 0,
      faltas_predichas:         0,
      factor_alpha:             Math.exp(-factorS),
      varianza_historica:       0,
      confianza_pct:            0,
      meses_analizados:         0,
    };

    const serieTasa = rows.map(r => {
      const total = +r.total || 1;
      return parseFloat(((+r.asistencias / total) * 100).toFixed(2));
    });

    const promedioTotal = rows.reduce((s, r) => s + (+r.total || 0), 0) / rows.length;
    const { prediccion, alpha, confianza_pct } = laplace(serieTasa, factorS);
    const media = serieTasa.reduce((a, b) => a + b, 0) / serieTasa.length;
    const varianza = serieTasa.reduce((a, b) => a + (b - media) ** 2, 0) / serieTasa.length;

    return {
      mes_predicho:             siguienteMes(rows[0].mes),
      tasa_asistencia_predicha: prediccion,
      faltas_predichas:         parseFloat(((1 - prediccion / 100) * promedioTotal).toFixed(0)),
      factor_alpha:             alpha,
      varianza_historica:       parseFloat(varianza.toFixed(4)),
      confianza_pct,
      meses_analizados:         rows.length,
    };
  }

  async prediccionCalificacionProximoPeriodo(factorS = 0.20, soloRiesgo = false) {
    const rows = await this.calificacionRepo
      .createQueryBuilder('cal')
      .innerJoin('cal.periodo', 'per')
      .innerJoin('cal.detGrupoMateria', 'det')
      .innerJoin('det.materia', 'm')
      .select('m.id_materia',               'materia_id')
      .addSelect('m.nombre',                'materia')
      .addSelect('per.id_periodo',          'periodo_id')
      .addSelect('per.nombre',              'periodo_nombre')
      .addSelect('per.fecha_inicio',        'fecha_inicio')
      .addSelect('ROUND(AVG(cal.valor), 2)', 'promedio') // Funciones de agregación SQL
      .addSelect('ROUND(STDDEV(cal.valor), 4)', 'desv_std')
      .addSelect('COUNT(*)',                'total')
      .groupBy('m.id_materia')
      .addGroupBy('m.nombre')
      .addGroupBy('per.id_periodo')
      .addGroupBy('per.nombre')
      .addGroupBy('per.fecha_inicio')
      .orderBy('m.id_materia', 'ASC')
      .addOrderBy('per.fecha_inicio', 'DESC')
      .getRawMany();

    if (!rows.length) return [];

    // Agrupamos en memoria (JavaScript) lo que nos trajo la base de datos
    const porMateria = new Map<string, typeof rows>();
    rows.forEach(r => {
      if (!porMateria.has(r.materia_id)) porMateria.set(r.materia_id, []);
      porMateria.get(r.materia_id)!.push(r);
    });

    const resultados: any[] = [];

    porMateria.forEach(periodos => {
      const serieProm = periodos.map(p => +p.promedio || 0);
      const desvMedia = periodos.map(p => +p.desv_std || 1).reduce((a, b) => a + b, 0) / periodos.length;
      const { prediccion, alpha, confianza_pct, tendencia } = laplace(serieProm, factorS);

      const distancia = 6 - prediccion;
      const riesgo = desvMedia > 0
        ? Math.max(0, Math.min(100, (distancia / desvMedia) * 50 + 10))
        : (prediccion < 6 ? 80 : 5);

      if (soloRiesgo && riesgo <= 20) return;

      resultados.push({
        periodo_predicho:       `Siguiente a: ${periodos[0].periodo_nombre}`,
        materia:                periodos[0].materia,
        promedio_predicho:      prediccion,
        factor_alpha:           alpha,
        riesgo_reprobacion_pct: parseFloat(riesgo.toFixed(1)),
        tendencia,
        confianza_pct,
      });
    });

    return resultados.sort((a, b) => b.riesgo_reprobacion_pct - a.riesgo_reprobacion_pct);
  }

  async prediccionDemandaGruposSiguienteCiclo(factorS = 0.12) {
    const rows = await this.inscripcionRepo
      .createQueryBuilder('ins')
      .innerJoin('ins.grupo', 'g')
      .innerJoin('g.ciclo', 'c')
      .select('c.id_ciclo', 'ciclo_id')
      .addSelect('c.nombre', 'ciclo')
      .addSelect('c.fecha_inicio', 'fecha_inicio')
      .addSelect('g.nivel', 'nivel')
      .addSelect('COUNT(DISTINCT ins.alumno_id)', 'inscritos')
      .addSelect('ROUND(AVG(g.cupo_maximo), 0)', 'cupo_prom')
      .groupBy('c.id_ciclo')
      .addGroupBy('c.nombre')
      .addGroupBy('c.fecha_inicio')
      .addGroupBy('g.nivel')
      .orderBy('c.fecha_inicio', 'DESC')
      .addOrderBy('g.nivel', 'ASC')
      .getRawMany();

    if (!rows.length) return [];

    const porNivel = new Map<string, typeof rows>();
    rows.forEach(r => {
      if (!porNivel.has(r.nivel)) porNivel.set(r.nivel, []);
      porNivel.get(r.nivel)!.push(r);
    });

    const cicloActual = rows[0].ciclo;
    const resultados: any[] = [];

    porNivel.forEach((ciclos, nivel) => {
      const serie = ciclos.map(c => +c.inscritos || 0);
      const cupoProm = +ciclos[0].cupo_prom || 30;
      const inscritosActuales = serie[0];
      const { prediccion, alpha, confianza_pct } = laplace(serie, factorS);

      resultados.push({
        ciclo_predicho:    `Siguiente a: ${cicloActual}`,
        nivel,
        grupos_necesarios: Math.ceil(prediccion / cupoProm),
        alumnos_esperados: Math.round(prediccion),
        factor_alpha:      alpha,
        crecimiento_pct:   inscritosActuales > 0
          ? parseFloat((((prediccion - inscritosActuales) / inscritosActuales) * 100).toFixed(1))
          : 0,
        confianza_pct,
      });
    });

    return resultados.sort((a, b) => a.nivel.localeCompare(b.nivel));
  }

  async prediccionRetardosEmpleados(mesesHistorico = 6, factorS = 0.22) {
    const mes = porMes('ae.fecha');
    const rows = await this.asistEmpleadoRepo
      .createQueryBuilder('ae')
      .innerJoin('ae.empleado', 'emp')
      .select('emp.departamento', 'departamento')
      .addSelect(mes, 'mes')
      .addSelect('SUM(ae.minutos_retardo)', 'minutos')
      .addSelect('COUNT(DISTINCT ae.empleado_id)', 'empleados_con_retardo')
      .where("ae.estado_asistencia = 'RETARDO'")
      .andWhere('emp.activo = :activo', { activo: true })
      .groupBy('emp.departamento')
      .addGroupBy(mes)
      .orderBy('emp.departamento', 'ASC')
      .addOrderBy('mes', 'DESC')
      .getRawMany();

    if (!rows.length) return [];

    const porDepto = new Map<string, typeof rows>();
    rows.forEach(r => {
      if (!porDepto.has(r.departamento)) porDepto.set(r.departamento, []);
      if (porDepto.get(r.departamento)!.length < mesesHistorico)
        porDepto.get(r.departamento)!.push(r);
    });

    const resultados: any[] = [];

    porDepto.forEach((meses, departamento) => {
      const { prediccion: minPredichos, alpha, confianza_pct, tendencia } =
        laplace(meses.map(m => +m.minutos || 0), factorS);
      const { prediccion: empRiesgo } =
        laplace(meses.map(m => +m.empleados_con_retardo || 0), factorS);

      resultados.push({
        mes_predicho:        siguienteMes(meses[0].mes),
        departamento,
        retardos_esperados:  minPredichos,
        empleados_en_riesgo: parseFloat(empRiesgo.toFixed(1)),
        factor_alpha:        alpha,
        tendencia,
        confianza_pct,
      });
    });

    return resultados.sort((a, b) => b.retardos_esperados - a.retardos_esperados);
  }

  async prediccionConsumoComedor(semanasHistorico = 8, factorS = 0.17) {
    const semanaExpr = `TO_CHAR(cc.fecha, 'IYYY-IW')`;

    const rows = await this.consumoRepo
      .createQueryBuilder('cc')
      .innerJoin('cc.menu', 'mc')
      .select(semanaExpr, 'semana_num')
      .addSelect('COUNT(*)', 'consumos')
      .addSelect(sumR('mc.costo'), 'ingreso')
      .addSelect('ROUND(AVG(mc.costo), 2)', 'precio_promedio')
      .addSelect('MIN(cc.fecha)', 'fecha_inicio_semana')
      .groupBy(semanaExpr)
      .orderBy('semana_num', 'DESC')
      .limit(semanasHistorico)
      .getRawMany();

    if (!rows.length) return {
      semana_predicha: siguienteSemana(semanaISO(new Date())),
      consumos_esperados: 0,
      ingreso_comedor_estimado: 0,
      factor_alpha: Math.exp(-factorS),
      variacion_estacional: 1.0,
      confianza_pct: 0,
      semanas_analizadas: 0,
    };

    const { prediccion: consumosP, alpha, confianza_pct } =
      laplace(rows.map(r => +r.consumos || 0), factorS);
    const { prediccion: ingresosP } =
      laplace(rows.map(r => +r.ingreso || 0), factorS);

    const semanaPredicha = siguienteSemana(semanaISO(new Date(rows[0].fecha_inicio_semana)));
    const mesNum = new Date(rows[0].fecha_inicio_semana).getMonth() + 1;

    const ajuste = (mesNum === 7 || mesNum === 8) ? 0.60
                 : (mesNum === 12)               ? 0.75
                 : (mesNum === 1)                ? 1.10
                 : 1.0;

    return {
      semana_predicha:          semanaPredicha,
      consumos_esperados:       parseFloat((consumosP * ajuste).toFixed(0)),
      ingreso_comedor_estimado: parseFloat((ingresosP * ajuste).toFixed(2)),
      factor_alpha:             alpha,
      variacion_estacional:     ajuste,
      confianza_pct,
      semanas_analizadas:       rows.length,
    };
  }
}
