import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {AsistenciaAlumno} from 'src/sistema-escolar/entities';
import {AsistenciaAlumnoService} from '../../services/asistenciaAlumno/asistenciaAlumno.service';
import {CreateAsistenciaAlumnoInput} from '../../dtos/asistenciaAlumno/create-asistenciaAlumno.input';
import {UpdateAsistenciaAlumnoInput} from '../../dtos/asistenciaAlumno/update-asistenciaAlumno.input';

@Resolver(() => AsistenciaAlumno)
export class AsistenciaAlumnoResolver {
  constructor(private readonly service: AsistenciaAlumnoService) {}

  @Query(() => [AsistenciaAlumno], {name: 'asistenciasAlumnos'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => [AsistenciaAlumno], {name: 'asistenciasAlumnosP'})
  findAllPaginate(
    @Args('page', {type: () => Int, nullable: true, defaultValue: 1}) page: number,
    @Args('limit', {type: () => Int, nullable: true, defaultValue: 10}) limit: number,
  ) {
    return this.service.findAllPaginate(page, limit);
  }

  @Query(() => AsistenciaAlumno, {name: 'asistenciaAlumno'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => AsistenciaAlumno, {name: 'createAsitenciaAlumno'})
  create(@Args('input') input: CreateAsistenciaAlumnoInput) {
    return this.service.create(input);
  }

  @Mutation(() => AsistenciaAlumno, {name: 'updateAsistenciaAlumno'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateAsistenciaAlumnoInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'removeAsitenciaAlumno'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
