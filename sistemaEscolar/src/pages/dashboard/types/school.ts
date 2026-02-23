export interface Alumno {
  id: string;
  matricula: string;
  nombre: string;
  correo: string;
  telefono: string;
  fechaNacimiento: string;
  fechaIngreso: string;
  estatus: "activo" | "baja";
}

export interface Materia {
  id: string;
  clave: string;
  nombre: string;
  creditos: number;
  semestre: number;
  horasSemana: number;
}

export interface Profesor {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  especialidad: string;
  estatus: "activo" | "inactivo";
}

export interface Inscripcion {
  id: string;
  idAlumno: string;
  idMateria: string;
  cicloEscolar: string;
  fechaInscripcion: string;
  estatus: "inscrito" | "baja";
}

export interface Calificacion {
  id: string;
  idInscripcion: string;
  parcial1: number | null;
  parcial2: number | null;
  parcial3: number | null;
  promedio: number | null;
  estatus: "aprobado" | "reprobado" | "en curso";
}

export type AlumnoForm = Omit<Alumno, "id" | "matricula">;
export type MateriaForm = Omit<Materia, "id">;
export type ProfesorForm = Omit<Profesor, "id">;
export type InscripcionForm = Omit<Inscripcion, "id" | "fechaInscripcion">;
export type CalificacionForm = Omit<Calificacion, "id" | "promedio" | "estatus">;
