import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {Alumno} from 'src/sistema-escolar/entities';
import {AlumnoService} from 'src/sistema-escolar/services';
import {CreateAlumnoInput} from 'src/sistema-escolar/dtos/alumno/create-alumno.input';
import {UpdateAlumnoInput} from 'src/sistema-escolar/dtos/alumno/update-alumno.input';

@Resolver(() => Alumno)
export class AlumnoResolver {
  constructor(private readonly service: AlumnoService) {}

  @Query(() => [Alumno], {name: 'alumnos'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => Alumno, {name: 'alumno'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => Alumno, {name: 'createAlumno'})
  create(@Args('input') input: CreateAlumnoInput) {
    return this.service.create(input);
  }

  @Mutation(() => Alumno, {name: 'updateAlumno'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateAlumnoInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'deleteAlumno'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
