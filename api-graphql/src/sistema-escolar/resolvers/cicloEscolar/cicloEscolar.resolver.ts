import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {CicloEscolar} from '../../entities/ciclos-escolares/ciclo-escolar.entity';
import {CicloEscolarService} from '../../services/cicloEscolar/cicloEscolar.service';
import {CreateCicloEscolarInput} from '../../dtos/cicloEscolar/create-cicloEscolar.input';
import {UpdateCicloEscolarInput} from '../../dtos/cicloEscolar/update-cicloEscolar.input';

@Resolver(() => CicloEscolar)
export class CicloEscolarResolver {
  constructor(private readonly service: CicloEscolarService) {}

  @Query(() => [CicloEscolar], {name: 'ciclosEscolares'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => [CicloEscolar], {name: 'ciclosEscolaresP'})
  findAllPaginate(
    @Args('page', {type: () => Int, nullable: true, defaultValue: 1}) page: number,
    @Args('limit', {type: () => Int, nullable: true, defaultValue: 10}) limit: number,
  ) {
    return this.service.findAllPaginate(page, limit);
  }

  @Query(() => CicloEscolar, {name: 'cicloEscolar'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => CicloEscolar, {name: 'createCicloEscolar'})
  create(@Args('input') input: CreateCicloEscolarInput) {
    return this.service.create(input);
  }

  @Mutation(() => CicloEscolar, {name: 'updateCicloEscolar'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateCicloEscolarInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'removeCicloEscolar'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
