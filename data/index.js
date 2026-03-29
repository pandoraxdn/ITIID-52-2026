/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  seed-generator.js  —  Sistema Escolar Pandora (PostgreSQL)    ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  Genera seed_pandora.sql con ≥ 100 000 registros por tabla     ║
 * ║                                                                ║
 * ║  USO:                                                          ║
 * ║    node index.js                                               ║
 * ║    psql -U postgres -d pandora -f seed_pandora.sql             ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ESTRATEGIA ANTI-DUPLICADOS EN FKs
 * ───────────────────────────────────
 * El problema original: pick(alumnoIds) puede devolver el mismo
 * alumno_id + grupo_id + ciclo_id en dos filas distintas de
 * inscripciones → error de constraint UNIQUE o datos inconsistentes.
 *
 * Solución aplicada tabla a tabla:
 *
 *  • Profesores → empleado_id  es 1-a-1 (OneToOne en la entity).
 *    Usamos los primeros 60 000 empleados, uno por profesor.
 *    Sin repetición posible.
 *
 *  • Det_grupos_materias → grupo_id + materia_id podría repetir.
 *    Generamos combinaciones únicas con un Set de pares ya usados.
 *
 *  • Alumnos-tutores → alumno_id + tutor_id podría repetir.
 *    Ídem, Set de pares ya usados.
 *
 *  • Inscripciones → alumno_id + grupo_id + ciclo_id podría repetir.
 *    Un alumno solo puede estar inscrito una vez por ciclo+grupo.
 *    Set de triplas ya usadas.
 *
 *  • Calificaciones → inscripcion_id + det_grupo_materia_id + periodo_id.
 *    Set de triplas ya usadas.
 *
 *  • Usuarios → empleado_id es único (OneToOne).
 *    Asignamos empleado i al usuario i directamente (sin pick).
 *
 *  • El resto de tablas (asistencias, pagos, consumos, etc.) admiten
 *    filas repetidas en sus FKs — son registros de eventos, no de
 *    relaciones únicas — por lo que usamos pick() libremente.
 *
 * ORDEN DE INSERCIÓN (padres antes que hijos)
 * ─────────────────────────────────────────────
 *  1. roles                     (sin FK)
 *  2. ciclos_escolares           (sin FK)
 *  3. periodos                  → ciclo
 *  4. materias                  (sin FK)
 *  5. empleados                 (sin FK)
 *  6. profesores                → empleado  (1-a-1)
 *  7. grupos                    → ciclo
 *  8. det_grupos_materias       → grupo, materia, profesor
 *  9. alumnos                   (sin FK)
 * 10. tutores                   (sin FK)
 * 11. alumnos-tutores           → alumno, tutor
 * 12. inscripciones             → alumno, grupo, ciclo
 * 13. calificaciones            → inscripcion, det, periodo
 * 14. asistencia-alumnos        → inscripcion, det
 * 15. asistencia-empleados      → empleado
 * 16. jornadas_laborales        → empleado
 * 17. justificante-empleados    → empleado
 * 18. menus-comedor             → ciclo
 * 19. consumos-comedor          → alumno, menu
 * 20. conceptos_pago            (sin FK)
 * 21. pagos                     → alumno, concepto
 * 22. horarios-clase            → det
 * 23. usuarios                  → rol, empleado (1-a-1)
 * 24. auditorias_log            → usuario
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ── Configuración ──────────────────────────────────────────────
const TARGET = 300_000;
const BATCH  = 500;
const OUTPUT = path.join(__dirname, 'seed_pandora.sql');

// ── LCG pseudo-random (sin dependencias npm) ───────────────────
let _seed = 42;
function rand()            { _seed = (_seed * 1664525 + 1013904223) & 0xffffffff; return (_seed >>> 0) / 0xffffffff; }
function randInt(min, max) { return Math.floor(rand() * (max - min + 1)) + min; }
function pick(arr)         { return arr[Math.floor(rand() * arr.length)]; }

// ── Helpers de formato ─────────────────────────────────────────
function esc(v)        { return String(v).replace(/'/g, "''"); }
function fmtDate(d)    { return d.toISOString().slice(0, 10); }
function fmtTime(h, m) { return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`; }
function bool(v)       { return v ? 'TRUE' : 'FALSE'; }

function randDate(y1 = 2015, y2 = 2025) {
  const a = new Date(y1, 0, 1).getTime();
  const b = new Date(y2, 11, 31).getTime();
  return new Date(a + rand() * (b - a));
}
function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

// ── Escritura en lotes ─────────────────────────────────────────
function insertBatch(stream, table, cols, rows) {
  if (!rows.length) return;
  const colStr = cols.map(c => `"${c}"`).join(', ');
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const vals  = chunk.map(r => `(${r})`).join(',\n  ');
    stream.write(`INSERT INTO "${table}" (${colStr}) VALUES\n  ${vals};\n`);
  }
}

// ── Catálogos ──────────────────────────────────────────────────
const TIPOS_SANGRE  = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
const GENEROS       = ['MASCULINO','FEMENINO'];
const TIPO_EMPLEADO = ['DOCENTE','ADMINISTRATIVO','OPERATIVO'];
const TIPO_PUESTO   = ['MAESTRO','DIRECTOR','LIMPIEZA','SEGURIDAD'];
const NIVEL_ESTUDIO = ['LICENCIATURA','MAESTRIA','DOCTORADO'];
const TIPO_TURNO    = ['MATUTINO','VESPERTINO'];
const TIPO_NIVEL    = ['INICIAL','PRIMARIA','SECUNDARIA','BACHILLERATO'];
const TIPO_MATERIA  = ['OBLIGATORIA','OPTATIVA','TALLER'];
const DIAS_SEMANA   = ['LUNES','MARTES','MIERCOLES','JUEVES','VIERNES'];
const TIPO_JUSTIF   = ['ENFERMEDAD','VACACIONES','PERSONAL'];
const ESTADO_APROB  = ['PENDIENTE','APROBADO','RECHAZADO'];
const TIPO_RELACION = ['PADRE','MADRE','TIO','ABUELO'];
const TIPO_PAGO     = ['EFECTIVO','TRANSFERENCIA','TARJETA'];
const ESTADO_PAGO_W = [...Array(75).fill('PAGADO'), ...Array(20).fill('PENDIENTE'), ...Array(5).fill('CANCELADO')];
const ESTADO_AL_W   = [...Array(80).fill('ASISTENCIA'), ...Array(10).fill('FALTA'), ...Array(5).fill('RETARDO'), ...Array(5).fill('JUSTIFICADO')];
const ESTADO_EM_W   = [...Array(85).fill('ASISTENCIA'), ...Array(8).fill('FALTA'), ...Array(4).fill('RETARDO'), ...Array(3).fill('JUSTIFICADO')];
const TIPO_CONS_W   = [...Array(70).fill('MENU ESCOLAR'), ...Array(20).fill('COMIDA DE CASA'), ...Array(10).fill('NO COMIO')];
const ACCIONES_LOG  = ['INSERT','UPDATE','DELETE','LOGIN','LOGOUT'];
const TABLAS_LOG    = ['alumnos','empleados','pagos','calificaciones','inscripciones'];
const BECAS_W       = [0,0,0,0,0,10,25,50,75,100];  // mayoría sin beca

const NOMBRES   = ['Juan','María','Carlos','Ana','Luis','Rosa','Pedro','Laura','Jorge','Elena',
                   'Andrés','Sofía','Miguel','Valentina','Diego','Camila','Ricardo','Gabriela',
                   'Fernando','Patricia','Roberto','Alejandra','Manuel','Daniela','Sergio','Natalia'];
const APELLIDOS = ['García','Hernández','López','Martínez','González','Rodríguez','Pérez',
                   'Sánchez','Ramírez','Torres','Flores','Rivera','Gómez','Díaz','Cruz',
                   'Morales','Reyes','Jiménez','Ruiz','Vargas','Mendoza','Castillo','Romero'];
const DEPTOS    = ['Matemáticas','Ciencias','Humanidades','Administración','Servicios',
                   'Dirección','TIC','Deportes','Arte','Idiomas'];
const ASIGNAT   = ['Matemáticas','Español','Ciencias Naturales','Historia','Geografía',
                   'Inglés','Educación Física','Arte','Tecnología','Física','Química',
                   'Biología','Cálculo','Álgebra','Literatura','Filosofía','Música'];
const PLATOS    = ['Arroz con pollo','Sopa de verduras','Enchiladas','Pasta primavera',
                   'Caldo de res','Tamales','Pozole','Quesadillas','Tostadas','Flautas'];

const nombre   = () => esc(pick(NOMBRES));
const apellido = () => esc(pick(APELLIDOS));
const tel      = () => `${randInt(55,99)}${randInt(10000000,99999999)}`;
const ip       = () => `${randInt(1,254)}.${randInt(0,254)}.${randInt(0,254)}.${randInt(1,254)}`;
const pwdHash  = () => '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8';

// ════════════════════════════════════════════════════════════════
// INICIO
// ════════════════════════════════════════════════════════════════
console.log(`\n🚀  Generando ${TARGET.toLocaleString()} registros/tabla para PostgreSQL...`);
console.log(`    Salida: ${OUTPUT}\n`);

const stream = fs.createWriteStream(OUTPUT, {encoding: 'utf8'});

stream.write(`-- ============================================================\n`);
stream.write(`-- SEED — Sistema Escolar Pandora (PostgreSQL)\n`);
stream.write(`-- Generado: ${new Date().toISOString()}\n`);
stream.write(`-- Registros por tabla principal: ${TARGET.toLocaleString()}\n`);
stream.write(`-- Importar: psql -U postgres -d pandora -f seed_pandora.sql\n`);
stream.write(`-- ============================================================\n\n`);

// Desactiva triggers/FKs para insertar en cualquier orden
stream.write(`SET session_replication_role = 'replica';\n\n`);


// ══════════════════════════════════════════════════════════════
// 1. ROLES (catálogo fijo)
// ══════════════════════════════════════════════════════════════
console.log('[01] roles...');
stream.write(`INSERT INTO "roles" ("id_rol","nombre","descripcion") VALUES
  (1,'ADMIN','Acceso total al sistema'),
  (2,'DOCENTE','Registro de calificaciones y asistencias'),
  (3,'ALUMNO','Consulta de calificaciones y horarios'),
  (4,'TUTOR','Consulta de información del alumno'),
  (5,'OPERATIVO','Acceso operativo limitado')
ON CONFLICT DO NOTHING;\n\n`);


// ══════════════════════════════════════════════════════════════
// 2. CICLOS ESCOLARES  — 11 ciclos, sin FK
// ══════════════════════════════════════════════════════════════
console.log('[02] ciclos_escolares...');
const cicloIds = [];
{
  const rows = [];
  for (let i = 0; i < 11; i++) {
    const y  = 2015 + i;
    const id = i + 1;
    cicloIds.push(id);
    rows.push(`${id},'${y}-${y+1}','${y}-08-01','${y+1}-07-31',${bool(i === 10)}`);
  }
  insertBatch(stream, 'ciclos_escolares',
    ['id_ciclo','nombre','fecha_inicio','fecha_fin','activo'], rows);
  stream.write('\n');
}


// ══════════════════════════════════════════════════════════════
// 3. PERIODOS  — 3 por ciclo = 33 total
// ══════════════════════════════════════════════════════════════
console.log('[03] periodos...');
const periodoIds = [];
{
  const rows = [];
  let pid = 1;
  for (const cid of cicloIds) {
    const y = 2014 + cid;
    for (let q = 1; q <= 3; q++) {
      const fi   = new Date(y, 7 + (q - 1) * 3, 1);
      const ff   = addDays(fi, 89);
      const flim = addDays(ff, 7);
      rows.push(`${pid},'Bimestre ${q} - ${y}','BIMESTRAL','${fmtDate(fi)}','${fmtDate(ff)}','${fmtDate(flim)}',${cid}`);
      periodoIds.push(pid++);
    }
  }
  insertBatch(stream, 'periodos',
    ['id_periodo','nombre','tipo','fecha_inicio','fecha_fin','fecha_limite_captura','ciclo_id'], rows);
  stream.write('\n');
}


// ══════════════════════════════════════════════════════════════
// 4. MATERIAS  — 100 000, sin FK
// ══════════════════════════════════════════════════════════════
console.log('[04] materias...');
const materiaIds = [];
{
  const rows   = [];
  const sufs   = ['I','II','III','IV','V','Avanzado','Básico','Aplicado','Teórico','Taller'];
  for (let i = 1; i <= TARGET; i++) {
    const nm = esc(`${pick(ASIGNAT)} ${pick(sufs)}`);
    rows.push(`${i},'MAT-${String(i).padStart(6,'0')}','${nm}',${randInt(4,10)},'${pick(TIPO_MATERIA)}','Descripción del plan de estudios'`);
    materiaIds.push(i);
  }
  insertBatch(stream, 'materias',
    ['id_materia','clave_oficial','nombre','creditos','tipo','descripcion'], rows);
  stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} materias`);


// ══════════════════════════════════════════════════════════════
// 5. EMPLEADOS  — 100 000, sin FK
// ══════════════════════════════════════════════════════════════
console.log('[05] empleados...');
const empleadoIds = [];
{
  const rows = [];
  for (let i = 1; i <= TARGET; i++) {
    const fc = fmtDate(randDate(2005, 2024));
    rows.push(
      `${i},'EMP-${String(i).padStart(6,'0')}','${nombre()}','${apellido()}','${apellido()}',` +
      `'emp${i}@gmail.com','emp${i}@pandora.edu.mx','${tel()}',` +
      `'${pick(TIPO_EMPLEADO)}','${pick(TIPO_PUESTO)}','${pick(DEPTOS)}','${fc}',${bool(rand() > 0.1)}`
    );
    empleadoIds.push(i);
  }
  insertBatch(stream, 'empleados',
    ['id_empleado','numero_empleado','nombre','apellido_p','apellido_m',
     'email_personal','email_institucional','telefono',
     'tipo_empleado','puesto','departamento','fecha_contratacion','activo'], rows);
  stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} empleados`);


// ══════════════════════════════════════════════════════════════
// 6. PROFESORES  — 60 000, FK: empleado_id (OneToOne → sin repetir)
//
// La entidad Profesor tiene OneToOne con Empleado.
// Por eso empleado_id debe ser ÚNICO en la tabla profesores.
// Solución: profesor i → empleado i (mapeo directo 1:1).
// ══════════════════════════════════════════════════════════════
console.log('[06] profesores...');
const profesorIds = [];
{
  const rows  = [];
  const TOTAL = 60_000;
  for (let i = 1; i <= TOTAL; i++) {
    // empleado_id = i  →  cada empleado aparece a lo sumo UNA vez
    rows.push(`${i},${i},'${esc(pick(ASIGNAT))}','${pick(NIVEL_ESTUDIO)}','CED-${String(i).padStart(7,'0')}'`);
    profesorIds.push(i);
  }
  insertBatch(stream, 'profesores',
    ['id_profesor','empleado_id','especialidad','nivel_estudios','cedula_profesional'], rows);
  stream.write('\n');
}
console.log(`    60,000 profesores`);


// ══════════════════════════════════════════════════════════════
// 7. GRUPOS  — 100 000, FK: ciclo_id
// Cada grupo pertenece a un ciclo (no hay unicidad en ciclo_id,
// pueden existir muchos grupos del mismo ciclo).
// ══════════════════════════════════════════════════════════════
console.log('[07] grupos...');
const grupoIds = [];
{
  const rows  = [];
  const letras = ['A','B','C','D','E','F','G','H'];
  for (let i = 1; i <= TARGET; i++) {
    rows.push(
      `${i},'Grupo ${i}','${pick(letras)}','${pick(TIPO_TURNO)}','${pick(TIPO_NIVEL)}',` +
      `${randInt(20,40)},'AULA-${String(randInt(1,50)).padStart(2,'0')}',${pick(cicloIds)}`
    );
    grupoIds.push(i);
  }
  insertBatch(stream, 'grupos',
    ['id_grupo','nombre','grupo','turno','nivel','cupo_maximo','aula','ciclo_id'], rows);
  stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} grupos`);


// ══════════════════════════════════════════════════════════════
// 8. DET_GRUPOS_MATERIAS  — 100 000
//    FK: grupo_id, materia_id, profesor_id
//
// Restricción lógica: un grupo NO debería tener la misma materia
// dos veces. Usamos un Set de pares "grupoId-materiaId" para
// garantizar unicidad.
// ══════════════════════════════════════════════════════════════
console.log('[08] det_grupos_materias...');
const detIds = [];
{
  const rows    = [];
  const usados  = new Set();   // controla pares grupo_id-materia_id únicos

  for (let i = 1; i <= TARGET; i++) {
    let gid, mid, key;
    let intentos = 0;

    // Busca una combinación grupo+materia que no exista aún
    do {
      gid  = grupoIds[Math.floor(rand() * grupoIds.length)];
      mid  = materiaIds[Math.floor(rand() * materiaIds.length)];
      key  = `${gid}-${mid}`;
      intentos++;
      // Si tras 50 intentos no hay combinación libre, permitimos repetir
      // (ocurre con TARGET muy alto respecto al universo de combinaciones)
    } while (usados.has(key) && intentos < 50);

    usados.add(key);
    const pfid = profesorIds[Math.floor(rand() * profesorIds.length)];
    rows.push(`${i},${gid},${mid},${pfid},'S${String(randInt(1,40)).padStart(2,'0')}'`);
    detIds.push(i);
  }
  insertBatch(stream, 'det_grupos_materias',
    ['id_det_grupo_materia','grupo_id','materia_id','profesor_id','salon_asignado'], rows);
  stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} det_grupos_materias`);


// ══════════════════════════════════════════════════════════════
// 9. ALUMNOS  — 100 000, sin FK
// ══════════════════════════════════════════════════════════════
console.log('[09] alumnos...');
const alumnoIds = [];
{
  const rows = [];
  for (let i = 1; i <= TARGET; i++) {
    const fi = fmtDate(randDate(2015, 2024));
    rows.push(
      `${i},'AL-${String(i).padStart(7,'0')}','${nombre()}','${apellido()}','${apellido()}',` +
      `'${pick(GENEROS)}','CURP${String(i).padStart(12,'0')}MX',` +
      `'al${i}@pandora.edu.mx','Calle ${randInt(1,999)} Col. Centro',` +
      `'${pick(TIPOS_SANGRE)}','Ninguna','Ninguna','${fi}',${bool(rand() > 0.08)}`
    );
    alumnoIds.push(i);
  }
  insertBatch(stream, 'alumnos',
    ['id_alumno','matricula','nombre','apellido_p','apellido_m','genero',
     'curp','email_institucional','direccion','tipo_sangre',
     'alergias','condiciones_medicas','fecha_ingreso','activo'], rows);
  stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} alumnos`);


// ══════════════════════════════════════════════════════════════
// 10. TUTORES  — 100 000, sin FK
// ══════════════════════════════════════════════════════════════
console.log('[10] tutores...');
const tutorIds = [];
{
  const rows = [];
  for (let i = 1; i <= TARGET; i++) {
    rows.push(`${i},'${nombre()}','${apellido()}','${apellido()}','${pick(TIPO_RELACION)}','${tel()}','${tel()}','tutor${i}@email.com'`);
    tutorIds.push(i);
  }
  insertBatch(stream, 'tutores',
    ['id_tutor','nombre','apellido_p','apellido_m','relacion',
     'telefono_principal','telefono_emergencia','email'], rows);
  stream.write('\n');
}


// ══════════════════════════════════════════════════════════════
// 11. ALUMNOS-TUTORES  — 100 000
//     FK: alumno_id, tutor_id
//
// Un alumno puede tener varios tutores, pero NO el mismo tutor
// registrado dos veces para el mismo alumno.
// Usamos un Set de pares "alumnoId-tutorId".
// ══════════════════════════════════════════════════════════════
console.log('[11] alumnos-tutores...');
{
  const rows   = [];
  const usados = new Set();

  for (let i = 1; i <= TARGET; i++) {
    let aid, tid, key;
    let intentos = 0;
    do {
      aid  = alumnoIds[Math.floor(rand() * alumnoIds.length)];
      tid  = tutorIds[Math.floor(rand() * tutorIds.length)];
      key  = `${aid}-${tid}`;
      intentos++;
    } while (usados.has(key) && intentos < 50);

    usados.add(key);
    rows.push(`${i},${aid},${tid},${bool(rand() > 0.7)}`);
  }
  insertBatch(stream, 'alumnos-tutores',
    ['id_de_al_tutor','alumno_id','tutor_id','es_tutor_financiero'], rows);
  stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} alumnos-tutores`);


// ══════════════════════════════════════════════════════════════
// 12. INSCRIPCIONES  — 100 000
//     FK: alumno_id, grupo_id, ciclo_id
//
// Un alumno solo puede estar inscrito UNA VEZ en el mismo
// grupo dentro del mismo ciclo.
// Usamos Set de triplas "alumnoId-grupoId-cicloId".
// ══════════════════════════════════════════════════════════════
console.log('[12] inscripciones...');
const inscripIds = [];
{
  const rows   = [];
  const usados = new Set();

  for (let i = 1; i <= TARGET; i++) {
    let aid, gid, cid, key;
    let intentos = 0;
    do {
      aid  = alumnoIds[Math.floor(rand() * alumnoIds.length)];
      gid  = grupoIds[Math.floor(rand() * grupoIds.length)];
      cid  = cicloIds[Math.floor(rand() * cicloIds.length)];
      key  = `${aid}-${gid}-${cid}`;
      intentos++;
    } while (usados.has(key) && intentos < 50);

    usados.add(key);
    const fi = fmtDate(randDate(2019, 2025));
    rows.push(`${i},${aid},${gid},${cid},'${fi}',${pick(BECAS_W)}`);
    inscripIds.push(i);
  }
  insertBatch(stream, 'inscripciones',
    ['id_inscripcion','alumno_id','grupo_id','ciclo_id','fecha_inscripcion','beca_porcentaje'], rows);
  stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} inscripciones`);


// ══════════════════════════════════════════════════════════════
// 13. CALIFICACIONES  — 100 000
//     FK: inscripcion_id, det_grupo_materia_id, periodo_id
//
// Una inscripción no puede tener la misma calificación dos veces
// para el mismo det_grupo_materia en el mismo periodo.
// Usamos Set de triplas.
// ══════════════════════════════════════════════════════════════
console.log('[13] calificaciones...');
{
  const rows   = [];
  const usados = new Set();

  for (let i = 1; i <= TARGET; i++) {
    let iid, did, perid, key;
    let intentos = 0;
    do {
      iid   = inscripIds[Math.floor(rand() * inscripIds.length)];
      did   = detIds[Math.floor(rand() * detIds.length)];
      perid = periodoIds[Math.floor(rand() * periodoIds.length)];
      key   = `${iid}-${did}-${perid}`;
      intentos++;
    } while (usados.has(key) && intentos < 50);

    usados.add(key);
    const valor   = Math.max(0, Math.min(10, 5 + rand() * 5)).toFixed(2);
    const faltas  = randInt(0, 15);
    const created = fmtDate(randDate(2019, 2025));
    rows.push(`${i},${iid},${did},${perid},${valor},${faltas},'Sin observaciones','${created}'`);
  }
  insertBatch(stream, 'calificaciones',
    ['id_calificacion','inscripcion_id','det_grupo_materia_id','periodo_id',
     'valor','faltas_periodo','observaciones','created_at'], rows);
  stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} calificaciones`);


// ══════════════════════════════════════════════════════════════
// 14. ASISTENCIA-ALUMNOS  — 100 000
//     FK: inscripcion_id, det_grupo_materia_id
//     Admite múltiples filas con la misma inscripción (distintas
//     fechas/días de clase) → pick() libre, sin Set.
// ══════════════════════════════════════════════════════════════
console.log('[14] asistencia-alumnos...');
{
  const rows = [];
  for (let i = 1; i <= TARGET; i++) {
    const iid   = inscripIds[Math.floor(rand() * inscripIds.length)];
    const did   = detIds[Math.floor(rand() * detIds.length)];
    const fecha = fmtDate(randDate(2019, 2025));
    rows.push(`${i},${iid},${did},'${fecha}','${pick(ESTADO_AL_W)}','Sin novedad'`);
  }
  insertBatch(stream, 'asistencia-alumnos',
    ['id_asistencia_al','inscripcion_id','det_grupo_materia_id',
     'fecha','estado_asistencia','observaciones'], rows);
  stream.write('\n');
}


// ══════════════════════════════════════════════════════════════
// 15. ASISTENCIA-EMPLEADOS  — 100 000
//     FK: empleado_id
//     Admite múltiples filas por empleado (distintos días) → libre.
// ══════════════════════════════════════════════════════════════
console.log('[15] asistencia-empleados...');
{
  const rows = [];
  for (let i = 1; i <= TARGET; i++) {
    const eid    = empleadoIds[Math.floor(rand() * empleadoIds.length)];
    const fecha  = fmtDate(randDate(2019, 2025));
    const hEnt   = randInt(7, 9);
    const mEnt   = pick([0, 15, 30]);
    const hSal   = randInt(14, 18);
    const estado = pick(ESTADO_EM_W);
    const ret    = estado === 'RETARDO' ? randInt(5, 45) : 0;
    rows.push(`${i},${eid},'${fecha}','${fmtTime(hEnt,mEnt)}','${fmtTime(hSal,0)}','${estado}',${ret},'Normal'`);
  }
  insertBatch(stream, 'asistencia-empleados',
    ['id_asistencia_emp','empleado_id','fecha','hora_entrada_real',
     'hora_salida_real','estado_asistencia','minutos_retardo','observaciones'], rows);
  stream.write('\n');
}


// ══════════════════════════════════════════════════════════════
// 16. JORNADAS_LABORALES  — 100 000
//     FK: empleado_id
//     Un empleado puede tener múltiples jornadas (una por día
//     de la semana) → libre.
// ══════════════════════════════════════════════════════════════
console.log('[16] jornadas_laborales...');
{
  const rows = [];
  for (let i = 1; i <= TARGET; i++) {
    const eid  = empleadoIds[Math.floor(rand() * empleadoIds.length)];
    const hEnt = pick([7, 8, 9]);
    const hSal = hEnt + randInt(7, 9);
    rows.push(`${i},${eid},'${pick(DIAS_SEMANA)}','${fmtTime(hEnt,0)}','${fmtTime(hSal,0)}',${pick([5,10,15])}`);
  }
  insertBatch(stream, 'jornadas_laborales',
    ['id_jornada','empleado_id','dia_semana','horaEntrada','horaSalida','tolerancia_minutos'], rows);
  stream.write('\n');
}


// ══════════════════════════════════════════════════════════════
// 17. JUSTIFICANTE-EMPLEADOS  — 100 000
//     FK: empleado_id  → admite múltiples justificantes → libre.
// ══════════════════════════════════════════════════════════════
console.log('[17] justificante-empleados...');
{
  const rows = [];
  for (let i = 1; i <= TARGET; i++) {
    const eid = empleadoIds[Math.floor(rand() * empleadoIds.length)];
    const fi  = randDate(2019, 2025);
    const ff  = addDays(fi, randInt(1, 10));
    rows.push(
      `${i},${eid},'${pick(TIPO_JUSTIF)}','${fmtDate(fi)}','${fmtDate(ff)}',` +
      `'Motivo de ausencia justificada','${pick(ESTADO_APROB)}','https://docs.pandora.edu/just/${i}.pdf'`
    );
  }
  insertBatch(stream, 'justificante-empleados',
    ['id_justificante_emp','empleado_id','tipo_justificante','fecha_inicio',
     'fecha_fin','motivo','estado_aprobacion','documento_url'], rows);
  stream.write('\n');
}


// ══════════════════════════════════════════════════════════════
// 18. MENUS-COMEDOR  — 100 000
//     FK: ciclo_id → admite muchos menús por ciclo → libre.
// ══════════════════════════════════════════════════════════════
console.log('[18] menus-comedor...');
const menuIds = [];
{
  const rows = [];
  for (let i = 1; i <= TARGET; i++) {
    const fecha = fmtDate(randDate(2018, 2025));
    rows.push(
      `${i},'${fecha}','${esc(pick(PLATOS))}','Menú del día nutritivo',` +
      `'${pick(['Ninguno','Gluten','Lactosa','Huevo'])}',${(15 + rand()*65).toFixed(2)},${pick(cicloIds)}`
    );
    menuIds.push(i);
  }
  insertBatch(stream, 'menus-comedor',
    ['id_menu','fecha','titulo','descripcion','alergenos','costo','ciclo_id'], rows);
  stream.write('\n');
}


// ══════════════════════════════════════════════════════════════
// 19. CONSUMOS-COMEDOR  — 100 000
//     FK: alumno_id, menu_id → admite múltiples consumos → libre.
// ══════════════════════════════════════════════════════════════
console.log('[19] consumos-comedor...');
{
  const rows = [];
  for (let i = 1; i <= TARGET; i++) {
    const aid   = alumnoIds[Math.floor(rand() * alumnoIds.length)];
    const mid   = menuIds[Math.floor(rand() * menuIds.length)];
    const fecha = fmtDate(randDate(2019, 2025));
    rows.push(`${i},${aid},'${fecha}','${pick(TIPO_CONS_W)}',${mid},'Sin novedad','Ninguna'`);
  }
  insertBatch(stream, 'consumos-comedor',
    ['id_consumo','alumno_id','fecha','tipo_consumo','menu_id','observaciones','reporte_incidencia'], rows);
  stream.write('\n');
}


// ══════════════════════════════════════════════════════════════
// 20. CONCEPTOS_PAGO (catálogo fijo, 20 registros)
// ══════════════════════════════════════════════════════════════
console.log('[20] conceptos_pago...');
stream.write(`INSERT INTO "conceptos_pago" ("id_concepto","nombre","monto","es_recurrente") VALUES
  (1,'Colegiatura mensual',2500.00,TRUE),
  (2,'Inscripción anual',8000.00,FALSE),
  (3,'Seguro escolar',350.00,FALSE),
  (4,'Uniforme',1200.00,FALSE),
  (5,'Material didáctico',600.00,TRUE),
  (6,'Comedor mensual',1800.00,TRUE),
  (7,'Excursión',500.00,FALSE),
  (8,'Actividades extracurriculares',300.00,TRUE),
  (9,'Examen de admisión',200.00,FALSE),
  (10,'Diploma y ceremonia',800.00,FALSE),
  (11,'Seguro de accidentes',250.00,FALSE),
  (12,'Transporte escolar',1500.00,TRUE),
  (13,'Certificado',100.00,FALSE),
  (14,'Laboratorio',400.00,TRUE),
  (15,'Biblioteca',150.00,TRUE),
  (16,'Internet y TIC',200.00,TRUE),
  (17,'Mantenimiento',350.00,TRUE),
  (18,'Talleres opcionales',400.00,TRUE),
  (19,'Clases de refuerzo',600.00,TRUE),
  (20,'Actividades deportivas',300.00,TRUE)
ON CONFLICT DO NOTHING;\n\n`);
const conceptoIds = Array.from({length: 20}, (_, i) => i + 1);


// ══════════════════════════════════════════════════════════════
// 21. PAGOS  — 100 000
//     FK: alumno_id, concepto_id → admite múltiples pagos → libre.
// ══════════════════════════════════════════════════════════════
console.log('[21] pagos...');
{
  const rows = [];
  for (let i = 1; i <= TARGET; i++) {
    const aid    = alumnoIds[Math.floor(rand() * alumnoIds.length)];
    const coid   = conceptoIds[Math.floor(rand() * conceptoIds.length)];
    const fecha  = fmtDate(randDate(2018, 2025));
    const metodo = pick(TIPO_PAGO);
    const estado = pick(ESTADO_PAGO_W);
    const ref    = metodo !== 'EFECTIVO' ? `'REF${String(i).padStart(9,'0')}'` : 'NULL';
    const monto  = (200 + rand() * 8300).toFixed(2);
    rows.push(`${i},${aid},${coid},${monto},'${fecha}','${metodo}','${estado}',${ref}`);
  }
  insertBatch(stream, 'pagos',
    ['id_pago','alumno_id','concepto_id','monto_pagado','fecha_pago',
     'metodo_pago','estado','referencia_bancaria'], rows);
  stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} pagos`);


// ══════════════════════════════════════════════════════════════
// 22. HORARIOS-CLASE  — 100 000
//     FK: det_grupo_materia_id → admite múltiples horarios → libre.
// ══════════════════════════════════════════════════════════════
console.log('[22] horarios-clase...');
{
  const rows = [];
  for (let i = 1; i <= TARGET; i++) {
    const did = detIds[Math.floor(rand() * detIds.length)];
    const h   = randInt(7, 17);
    rows.push(`${i},${did},'${pick(DIAS_SEMANA)}','${fmtTime(h,0)}','${fmtTime(h+1,0)}'`);
  }
  insertBatch(stream, 'horarios-clase',
    ['id_horario_clase','det_grupo_materia_id','dia_semana','hora_inicio','hora_fin'], rows);
  stream.write('\n');
}


// ══════════════════════════════════════════════════════════════
// 23. USUARIOS  — 100 000
//     FK: rol_id, empleado_id (OneToOne)
//
// La entity Usuario tiene OneToOne con Empleado →
// empleado_id debe ser ÚNICO en la tabla usuarios.
// Solución: usuario i → empleado i (mapeo directo 1:1).
// ══════════════════════════════════════════════════════════════
console.log('[23] usuarios...');
const usuarioIds = [];
{
  const rows  = [];
  const roles = [1, 2, 3, 4, 5];
  for (let i = 1; i <= TARGET; i++) {
    const fecha = fmtDate(randDate(2022, 2025));
    // empleado_id = i  →  sin repetir (OneToOne)
    rows.push(
      `${i},'user${String(i).padStart(7,'0')}','${pwdHash()}',${pick(roles)},` +
      `${i},NULL,NULL,` +
      `'https://api.dicebear.com/7.x/avataaars/svg?seed=${i}','${fecha}',${bool(rand() > 0.07)}`
    );
    usuarioIds.push(i);
  }
  insertBatch(stream, 'usuarios',
    ['id_usuario','username','password_hash','rol_id',
     'empleado_id','alumno_id','tutor_id','avatar_url','ultimo_acceso','activo'], rows);
  stream.write('\n');
}
console.log(`    ${TARGET.toLocaleString()} usuarios`);


// ══════════════════════════════════════════════════════════════
// 24. AUDITORIAS_LOG  — 100 000
//     FK: usuario_id → admite múltiples logs → libre.
// ══════════════════════════════════════════════════════════════
console.log('[24] auditorias_log...');
{
  const rows = [];
  for (let i = 1; i <= TARGET; i++) {
    const uid   = usuarioIds[Math.floor(rand() * usuarioIds.length)];
    const fecha = fmtDate(randDate(2019, 2025));
    rows.push(
      `${i},${uid},'${pick(ACCIONES_LOG)}','${pick(TABLAS_LOG)}',` +
      `${randInt(1,100000)},'valor anterior','valor nuevo','${fecha}','${ip()}'`
    );
  }
  insertBatch(stream, 'auditorias_log',
    ['id_log','usuario_id','accion','tabla_afectada','registro_id',
     'valor_anterior','valor_nuevo','fecha','ip'], rows);
  stream.write('\n');
}


// ══════════════════════════════════════════════════════════════
// RESTAURAR RESTRICCIONES + ACTUALIZAR SECUENCIAS
// ══════════════════════════════════════════════════════════════
stream.write(`SET session_replication_role = DEFAULT;\n\n`);

stream.write(`-- Avanza las secuencias hasta el MAX(id) de cada tabla\n`);
stream.write(`-- (necesario porque insertamos IDs manuales)\n`);
const tablas = [
  ['roles',                'id_rol'],
  ['ciclos_escolares',     'id_ciclo'],
  ['periodos',             'id_periodo'],
  ['materias',             'id_materia'],
  ['empleados',            'id_empleado'],
  ['profesores',           'id_profesor'],
  ['grupos',               'id_grupo'],
  ['det_grupos_materias',  'id_det_grupo_materia'],
  ['alumnos',              'id_alumno'],
  ['tutores',              'id_tutor'],
  ['alumnos-tutores',      'id_de_al_tutor'],
  ['inscripciones',        'id_inscripcion'],
  ['calificaciones',       'id_calificacion'],
  ['asistencia-alumnos',   'id_asistencia_al'],
  ['asistencia-empleados', 'id_asistencia_emp'],
  ['jornadas_laborales',   'id_jornada'],
  ['justificante-empleados','id_justificante_emp'],
  ['menus-comedor',        'id_menu'],
  ['consumos-comedor',     'id_consumo'],
  ['conceptos_pago',       'id_concepto'],
  ['pagos',                'id_pago'],
  ['horarios-clase',       'id_horario_clase'],
  ['usuarios',             'id_usuario'],
  ['auditorias_log',       'id_log'],
];
for (const [t, c] of tablas) {
  stream.write(
    `SELECT setval(pg_get_serial_sequence('"${t}"','${c}'),` +
    `COALESCE((SELECT MAX("${c}") FROM "${t}"),1));\n`
  );
}

stream.write(`\n-- FIN DEL SEED\n`);

stream.end(() => {
  const mb = (fs.statSync(OUTPUT).size / 1024 / 1024).toFixed(1);
  console.log(`\n✅  COMPLETADO`);
  console.log(`    Archivo : ${OUTPUT}`);
  console.log(`    Tamaño  : ${mb} MB`);
  console.log(`\n📦  Para importar:`);
  console.log(`    psql -U postgres -d pandora -f seed_pandora.sql\n`);
});
