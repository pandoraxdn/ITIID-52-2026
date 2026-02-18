import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {Inscripcion} from '../../entities/inscripciones/inscripcion.entity';
import {InscripcionService} from '../../services/inscripcion/inscripcion.service';
import {CreateInscripcionInput} from '../../dtos/inscripcion/create-inscripcion.input';
import {UpdateInscripcionInput} from '../../dtos/inscripcion/update-inscripcion.input';

@Resolver(() => Inscripcion)
export class InscripcionResolver {
  constructor(private readonly service: InscripcionService) {}

  @Query(() => [Inscripcion], {name: 'inscripciones'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => Inscripcion, {name: 'inscripcion'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => Inscripcion, {name: 'createInscripcion'})
  create(@Args('input') input: CreateInscripcionInput) {
    return this.service.create(input);
  }

  @Mutation(() => Inscripcion, {name: 'updateInscripcion'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateInscripcionInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'deleteInscripcion'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
