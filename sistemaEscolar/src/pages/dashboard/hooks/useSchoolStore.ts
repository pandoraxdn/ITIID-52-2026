import {useState, useCallback} from "react";
import {
  Alumno,
  AlumnoForm,
  Calificacion,
  CalificacionForm,
  Inscripcion,
  InscripcionForm,
  Materia,
  MateriaForm,
  Profesor,
  ProfesorForm
} from "@/pages/dashboard/types/school";

const KEYS = {
  alumnos: "school_alumnos",
  materias: "school_materias",
  profesores: "school_profesores",
  inscripciones: "school_inscripciones",
  calificaciones: "school_calificaciones",
};

function load<T>(key: string, fallback: T[]): T[] {
  try {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : fallback;
  } catch {return fallback;}
}

function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

let matriculaCounter = 1000;

const seedAlumnos: Alumno[] = [
  {id: "a1", matricula: "MAT-1001", nombre: "Juan Pérez García", correo: "juan@escuela.edu", telefono: "555-0101", fechaNacimiento: "2005-03-15", fechaIngreso: "2023-08-20", estatus: "activo"},
  {id: "a2", matricula: "MAT-1002", nombre: "María López Hernández", correo: "maria@escuela.edu", telefono: "555-0102", fechaNacimiento: "2004-07-22", fechaIngreso: "2023-08-20", estatus: "activo"},
  {id: "a3", matricula: "MAT-1003", nombre: "Carlos Ramírez Torres", correo: "carlos@escuela.edu", telefono: "555-0103", fechaNacimiento: "2005-11-08", fechaIngreso: "2024-01-15", estatus: "activo"},
  {id: "a4", matricula: "MAT-1004", nombre: "Ana Martínez Ruiz", correo: "ana@escuela.edu", telefono: "555-0104", fechaNacimiento: "2004-01-30", fechaIngreso: "2023-08-20", estatus: "baja"},
];

const seedMaterias: Materia[] = [
  {id: "m1", clave: "MAT-101", nombre: "Matemáticas I", creditos: 8, semestre: 1, horasSemana: 5},
  {id: "m2", clave: "PROG-101", nombre: "Programación I", creditos: 6, semestre: 1, horasSemana: 4},
  {id: "m3", clave: "FIS-101", nombre: "Física I", creditos: 7, semestre: 1, horasSemana: 5},
  {id: "m4", clave: "MAT-201", nombre: "Matemáticas II", creditos: 8, semestre: 2, horasSemana: 5},
  {id: "m5", clave: "BD-201", nombre: "Bases de Datos", creditos: 6, semestre: 2, horasSemana: 4},
];

const seedProfesores: Profesor[] = [
  {id: "p1", nombre: "Dr. Roberto Sánchez", correo: "r.sanchez@escuela.edu", telefono: "555-0201", especialidad: "Matemáticas", estatus: "activo"},
  {id: "p2", nombre: "Ing. Laura Castillo", correo: "l.castillo@escuela.edu", telefono: "555-0202", especialidad: "Computación", estatus: "activo"},
  {id: "p3", nombre: "M.C. Fernando Díaz", correo: "f.diaz@escuela.edu", telefono: "555-0203", especialidad: "Física", estatus: "activo"},
];

const seedInscripciones: Inscripcion[] = [
  {id: "i1", idAlumno: "a1", idMateria: "m1", cicloEscolar: "2025-1", fechaInscripcion: "2025-01-15", estatus: "inscrito"},
  {id: "i2", idAlumno: "a1", idMateria: "m2", cicloEscolar: "2025-1", fechaInscripcion: "2025-01-15", estatus: "inscrito"},
  {id: "i3", idAlumno: "a2", idMateria: "m1", cicloEscolar: "2025-1", fechaInscripcion: "2025-01-16", estatus: "inscrito"},
  {id: "i4", idAlumno: "a3", idMateria: "m3", cicloEscolar: "2025-1", fechaInscripcion: "2025-01-20", estatus: "inscrito"},
];

const seedCalificaciones: Calificacion[] = [
  {id: "c1", idInscripcion: "i1", parcial1: 8, parcial2: 9, parcial3: 7, promedio: 8, estatus: "aprobado"},
  {id: "c2", idInscripcion: "i2", parcial1: 9, parcial2: 10, parcial3: 9, promedio: 9.3, estatus: "aprobado"},
  {id: "c3", idInscripcion: "i3", parcial1: 5, parcial2: 6, parcial3: 4, promedio: 5, estatus: "reprobado"},
];

function calcPromedio(p1: number | null, p2: number | null, p3: number | null): {promedio: number | null; estatus: Calificacion["estatus"]} {
  if (p1 === null || p2 === null || p3 === null) return {promedio: null, estatus: "en curso"};
  const avg = Math.round(((p1 + p2 + p3) / 3) * 10) / 10;
  return {promedio: avg, estatus: avg >= 6 ? "aprobado" : "reprobado"};
}

export function useSchoolStore() {
  const [alumnos, setAlumnos] = useState<Alumno[]>(() => load(KEYS.alumnos, seedAlumnos));
  const [materias, setMaterias] = useState<Materia[]>(() => load(KEYS.materias, seedMaterias));
  const [profesores, setProfesores] = useState<Profesor[]>(() => load(KEYS.profesores, seedProfesores));
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>(() => load(KEYS.inscripciones, seedInscripciones));
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>(() => load(KEYS.calificaciones, seedCalificaciones));

  // Alumnos
  const createAlumno = useCallback((data: AlumnoForm) => {
    matriculaCounter++;
    const a: Alumno = {...data, id: crypto.randomUUID(), matricula: `MAT-${matriculaCounter}`};
    const next = [a, ...alumnos];
    setAlumnos(next); save(KEYS.alumnos, next);
  }, [alumnos]);

  const updateAlumno = useCallback((id: string, data: AlumnoForm) => {
    const next = alumnos.map(a => a.id === id ? {...a, ...data} : a);
    setAlumnos(next); save(KEYS.alumnos, next);
  }, [alumnos]);

  const deleteAlumno = useCallback((id: string) => {
    const next = alumnos.map(a => a.id === id ? {...a, estatus: "baja" as const} : a);
    setAlumnos(next); save(KEYS.alumnos, next);
  }, [alumnos]);

  // Materias
  const createMateria = useCallback((data: MateriaForm) => {
    const m: Materia = {...data, id: crypto.randomUUID()};
    const next = [m, ...materias];
    setMaterias(next); save(KEYS.materias, next);
  }, [materias]);

  const updateMateria = useCallback((id: string, data: MateriaForm) => {
    const next = materias.map(m => m.id === id ? {...m, ...data} : m);
    setMaterias(next); save(KEYS.materias, next);
  }, [materias]);

  const deleteMateria = useCallback((id: string) => {
    const next = materias.filter(m => m.id !== id);
    setMaterias(next); save(KEYS.materias, next);
  }, [materias]);

  // Profesores
  const createProfesor = useCallback((data: ProfesorForm) => {
    const p: Profesor = {...data, id: crypto.randomUUID()};
    const next = [p, ...profesores];
    setProfesores(next); save(KEYS.profesores, next);
  }, [profesores]);

  const updateProfesor = useCallback((id: string, data: ProfesorForm) => {
    const next = profesores.map(p => p.id === id ? {...p, ...data} : p);
    setProfesores(next); save(KEYS.profesores, next);
  }, [profesores]);

  const deleteProfesor = useCallback((id: string) => {
    const next = profesores.map(p => p.id === id ? {...p, estatus: "inactivo" as const} : p);
    setProfesores(next); save(KEYS.profesores, next);
  }, [profesores]);

  // Inscripciones
  const createInscripcion = useCallback((data: InscripcionForm) => {
    // Check duplicate
    const exists = inscripciones.some(i => i.idAlumno === data.idAlumno && i.idMateria === data.idMateria && i.cicloEscolar === data.cicloEscolar && i.estatus === "inscrito");
    if (exists) throw new Error("El alumno ya está inscrito en esta materia en este ciclo");
    const ins: Inscripcion = {...data, id: crypto.randomUUID(), fechaInscripcion: new Date().toISOString().split("T")[0]};
    const next = [ins, ...inscripciones];
    setInscripciones(next); save(KEYS.inscripciones, next);
  }, [inscripciones]);

  const updateInscripcion = useCallback((id: string, data: Partial<InscripcionForm>) => {
    const next = inscripciones.map(i => i.id === id ? {...i, ...data} : i);
    setInscripciones(next); save(KEYS.inscripciones, next);
  }, [inscripciones]);

  const deleteInscripcion = useCallback((id: string) => {
    const next = inscripciones.map(i => i.id === id ? {...i, estatus: "baja" as const} : i);
    setInscripciones(next); save(KEYS.inscripciones, next);
  }, [inscripciones]);

  // Calificaciones
  const createCalificacion = useCallback((data: CalificacionForm) => {
    const {promedio, estatus} = calcPromedio(data.parcial1, data.parcial2, data.parcial3);
    const cal: Calificacion = {...data, id: crypto.randomUUID(), promedio, estatus};
    const next = [cal, ...calificaciones];
    setCalificaciones(next); save(KEYS.calificaciones, next);
  }, [calificaciones]);

  const updateCalificacion = useCallback((id: string, data: CalificacionForm) => {
    const {promedio, estatus} = calcPromedio(data.parcial1, data.parcial2, data.parcial3);
    const next = calificaciones.map(c => c.id === id ? {...c, ...data, promedio, estatus} : c);
    setCalificaciones(next); save(KEYS.calificaciones, next);
  }, [calificaciones]);

  const deleteCalificacion = useCallback((id: string) => {
    const next = calificaciones.filter(c => c.id !== id);
    setCalificaciones(next); save(KEYS.calificaciones, next);
  }, [calificaciones]);

  // Helpers
  const getAlumnoName = useCallback((id: string) => alumnos.find(a => a.id === id)?.nombre ?? "Desconocido", [alumnos]);
  const getMateriaName = useCallback((id: string) => materias.find(m => m.id === id)?.nombre ?? "Desconocida", [materias]);
  const getInscripcionLabel = useCallback((id: string) => {
    const ins = inscripciones.find(i => i.id === id);
    if (!ins) return "Desconocida";
    return `${getAlumnoName(ins.idAlumno)} - ${getMateriaName(ins.idMateria)}`;
  }, [inscripciones, getAlumnoName, getMateriaName]);

  return {
    alumnos, createAlumno, updateAlumno, deleteAlumno,
    materias, createMateria, updateMateria, deleteMateria,
    profesores, createProfesor, updateProfesor, deleteProfesor,
    inscripciones, createInscripcion, updateInscripcion, deleteInscripcion,
    calificaciones, createCalificacion, updateCalificacion, deleteCalificacion,
    getAlumnoName, getMateriaName, getInscripcionLabel,
  };
}
