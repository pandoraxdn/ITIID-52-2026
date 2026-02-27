import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {HorarioClase} from '../../entities/horarios-clase/horario-clase.entity';
import {HorarioClaseService} from '../../services/horarioClase/horarioClase.service';
import {CreateHorarioClaseInput} from '../../dtos/horarioClase/create-horarioClase.input';
import {UpdateHorarioClaseInput} from '../../dtos/horarioClase/update-horarioClase.input';

@Resolver(() => HorarioClase)
export class HorarioClaseResolver {
  constructor(private readonly service: HorarioClaseService) {}

  @Query(() => [HorarioClase], {name: 'horariosClase'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => [HorarioClase], {name: 'horariosClaseP'})
  findAllPaginate(
    @Args('page', {type: () => Int, nullable: true, defaultValue: 1}) page: number,
    @Args('limit', {type: () => Int, nullable: true, defaultValue: 10}) limit: number,
  ) {
    return this.service.findAllPaginate(page, limit);
  }

  @Query(() => HorarioClase, {name: 'horarioClase'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => HorarioClase, {name: 'createHorarioClase'})
  create(@Args('input') input: CreateHorarioClaseInput) {
    return this.service.create(input);
  }

  @Mutation(() => HorarioClase, {name: 'updateHorarioClase'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateHorarioClaseInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'removeHorarioClase'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
