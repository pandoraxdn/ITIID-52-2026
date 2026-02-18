import {Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany} from "typeorm";
import {ObjectType, Field, ID} from "@nestjs/graphql";
import {Inscripcion} from "../inscripciones/inscripcion.entity";
import {ConsumoComedor} from "../consumos-comedor/consumo-comedor.entity";
import {AlumnoTutor} from "../alumnos-tutores/alumno-tutor.entity";
import {Pago} from "../pagos/pago.entity";
import {Usuario} from "../usuarios/usuario.entity";

@ObjectType()
@Entity('alumnos')
export class Alumno {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_alumno: number;

  @Field(() => String)
  @Column({unique: true})
  matricula: string;

  @Field(() => String)
  @Column()
  nombre: string;

  @Field(() => String)
  @Column()
  apellido_p: string;

  @Field(() => String)
  @Column()
  apellido_m: string;

  @Field(() => String)
  @Column()
  genero: string;

  @Field(() => String)
  @Column({unique: true})
  curp: string;

  @Field(() => String)
  @Column()
  email_institucional: string;

  @Field(() => String)
  @Column({type: "text"})
  direccion: string;

  @Field(() => String)
  @Column()
  tipo_sangre: string;

  @Field(() => String)
  @Column({type: "text"})
  alergias: string;

  @Field(() => String)
  @Column({type: "text"})
  condiciones_medicas: string;

  @Field(() => Date)
  @Column({type: 'date'})
  fecha_ingreso: Date;

  @Field(() => Boolean)
  @Column({type: "boolean"})
  activo: boolean;

  @OneToMany(() => Inscripcion, inscripcion => inscripcion.alumno)
  inscripciones: Inscripcion[];

  @OneToMany(() => ConsumoComedor, consumo => consumo.alumno)
  consumos: ConsumoComedor[];

  @OneToMany(() => AlumnoTutor, at => at.alumno)
  alumnosTutores: AlumnoTutor[];

  @OneToMany(() => Pago, pago => pago.alumno)
  pagos: Pago[];

  @OneToOne(() => Usuario, usuario => usuario.alumno)
  usuario: Usuario;
}
