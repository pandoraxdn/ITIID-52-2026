import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {Periodo} from '../../entities/periodos/periodo.entity';
import {PeriodoService} from '../../services/periodo/periodo.service';
import {CreatePeriodoInput} from '../../dtos/periodo/create-periodo.input';
import {UpdatePeriodoInput} from '../../dtos/periodo/update-periodo.input';

@Resolver(() => Periodo)
export class PeriodoResolver {
  constructor(private readonly service: PeriodoService) {}

  @Query(() => [Periodo], {name: 'periodos'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => [Periodo], {name: 'periodosP'})
  findAllPaginate(
    @Args('page', {type: () => Int, nullable: true, defaultValue: 1}) page: number,
    @Args('limit', {type: () => Int, nullable: true, defaultValue: 10}) limit: number,
  ) {
    return this.service.findAllPaginate(page, limit);
  }

  @Query(() => Periodo, {name: 'periodo'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => Periodo, {name: 'createPeriodo'})
  create(@Args('input') input: CreatePeriodoInput) {
    return this.service.create(input);
  }

  @Mutation(() => Periodo, {name: 'updatePeriodo'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdatePeriodoInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'removePeriodo'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
