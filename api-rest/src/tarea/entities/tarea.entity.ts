import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Tarea {
  @PrimaryGeneratedColumn()
  id_tarea: number;

  @Column()
  nombre: string;

  @Column()
  materia: string;

  @Column()
  fecha: string;

  @Column()
  prioridad: number;
}
