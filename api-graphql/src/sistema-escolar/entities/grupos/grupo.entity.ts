import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from "typeorm";
import {ObjectType, Field, ID, Int, registerEnumType} from "@nestjs/graphql";
import {CicloEscolar} from "../ciclos-escolares/ciclo-escolar.entity";
import {Inscripcion} from "../inscripciones/inscripcion.entity";
import {DetGrupoMateria} from "../det-grupos-materias/det-grupo-materia.entity";

export enum TipoTurno {
  MATUTINO = 'MATUTINO',
  VESPERTINO = 'VESPERTINO',
}

export enum TipoNivel {
  INICIAL = 'INICIAL',
  PRIMARIA = 'PRIMARIA',
  SECUNDARIA = 'SECUNDARIA',
  BACHILLERATO = 'BACHILLERATO'
}

registerEnumType(TipoTurno, {
  name: 'TipoTurno',
});

registerEnumType(TipoNivel, {
  name: 'TipoNivel',
});

@ObjectType()
@Entity('grupos')
export class Grupo {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_grupo: number;

  @Field(() => String)
  @Column()
  nombre: string;

  @Field(() => String)
  @Column()
  grupo: string;

  @Field(() => TipoTurno)
  @Column({type: "enum", enum: TipoTurno})
  turno: TipoTurno;

  @Field(() => TipoNivel)
  @Column({type: "enum", enum: TipoNivel})
  nivel: TipoNivel;

  @Field(() => Int)
  @Column({type: "int", default: 30})
  cupo_maximo: number;

  @Field(() => String)
  @Column()
  aula: string;

  @Field(() => Int)
  @Column()
  ciclo_id: number;

  @ManyToOne(() => CicloEscolar, ciclo => ciclo.grupos, {nullable: true, onDelete: 'SET NULL'})
  @JoinColumn({name: 'ciclo_id'})
  ciclo: CicloEscolar;

  @OneToMany(() => Inscripcion, inscripcion => inscripcion.grupo)
  inscripciones: Inscripcion[];

  @OneToMany(() => DetGrupoMateria, det => det.grupo)
  detGruposMaterias: DetGrupoMateria[];
}
