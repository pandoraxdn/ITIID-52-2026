import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {ObjectType, Field, ID, Int, registerEnumType} from "@nestjs/graphql";
import {DetGrupoMateria} from "../det-grupos-materias/det-grupo-materia.entity";

export enum TipoMateria {
  OBLIGATORIA = 'OBLIGATORIA',
  OPTATIVA = 'OPTATIVA',
  TALLER = 'TALLER',
}

registerEnumType(TipoMateria, {
  name: 'TipoMateria',
});

@ObjectType()
@Entity('materias')
export class Materia {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_materia: number;

  @Field(() => String)
  @Column()
  clave_oficial: string;

  @Field(() => String)
  @Column()
  nombre: string;

  @Field(() => Int)
  @Column({type: "int"})
  creditos: number;

  @Field(() => TipoMateria)
  @Column({type: "enum", enum: TipoMateria, default: TipoMateria.OBLIGATORIA})
  tipo: TipoMateria;

  @Field(() => String)
  @Column({type: "text"})
  descripcion: string;

  @OneToMany(() => DetGrupoMateria, det => det.materia)
  detGruposMaterias: DetGrupoMateria[];
}
