import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {Calificacion} from '../../entities/calificaciones/calificacion.entity';
import {CalificacionService} from '../../services/calificacion/calificacion.service';
import {CreateCalificacionInput} from '../../dtos/calificacion/create-calificacion.input';
import {UpdateCalificacionInput} from '../../dtos/calificacion/update-calificacion.input';

@Resolver(() => Calificacion)
export class CalificacionResolver {
  constructor(private readonly service: CalificacionService) {}

  @Query(() => [Calificacion], {name: 'calificaciones'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => Calificacion, {name: 'calificacion'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => Calificacion, {name: 'createCalificacion'})
  create(@Args('input') input: CreateCalificacionInput) {
    return this.service.create(input);
  }

  @Mutation(() => Calificacion, {name: 'updateCalificacion'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateCalificacionInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'removeCalificacion'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
