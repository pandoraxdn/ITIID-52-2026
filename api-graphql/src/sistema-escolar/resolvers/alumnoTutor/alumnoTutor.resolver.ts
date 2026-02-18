import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {AlumnoTutor} from '../../entities/alumnos-tutores/alumno-tutor.entity';
import {AlumnoTutorService} from '../../services/alumnoTutor/alumnoTutor.service';
import {CreateAlumnoTutorInput} from 'src/sistema-escolar/dtos/alumnoTutor/create-alumnoTutor.input';
import {UpdateAlumnoTutorInput} from 'src/sistema-escolar/dtos/alumnoTutor/update-alumnoTutor.input';

@Resolver(() => AlumnoTutor)
export class AlumnoTutorResolver {
  constructor(private readonly service: AlumnoTutorService) {}

  @Query(() => [AlumnoTutor])
  findAll() {
    return this.service.findAll();
  }

  @Query(() => AlumnoTutor, {name: 'alumnosTutores'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => AlumnoTutor, {name: 'alumnoTutor'})
  create(@Args('input') input: CreateAlumnoTutorInput) {
    return this.service.create(input);
  }

  @Mutation(() => AlumnoTutor, {name: 'updateAlumnoTutor'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateAlumnoTutorInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'alumnoTutorDelete'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
