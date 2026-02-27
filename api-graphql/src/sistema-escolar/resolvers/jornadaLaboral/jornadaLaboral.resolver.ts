import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {JornadaLaboral} from '../../entities/jornadas-laborales/jornada-laboral.entity';
import {JornadaLaboralService} from '../../services/jornadaLaboral/jornadaLaboral.service';
import {CreateJornadaLaboralInput} from '../../dtos/jornadaLaboral/create-jornadaLaboral.input';
import {UpdateJornadaLaboralInput} from '../../dtos/jornadaLaboral/update-jornadaLaboral.input';

@Resolver(() => JornadaLaboral)
export class JornadaLaboralResolver {
  constructor(private readonly service: JornadaLaboralService) {}

  @Query(() => [JornadaLaboral], {name: 'jornadasLaborales'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => [JornadaLaboral], {name: 'jornadasLaboralesP'})
  findAllPaginate(
    @Args('page', {type: () => Int, nullable: true, defaultValue: 1}) page: number,
    @Args('limit', {type: () => Int, nullable: true, defaultValue: 10}) limit: number,
  ) {
    return this.service.findAllPaginate(page, limit);
  }

  @Query(() => JornadaLaboral, {name: 'jornadaLaboral'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => JornadaLaboral, {name: 'createJornadaLaboral'})
  create(@Args('input') input: CreateJornadaLaboralInput) {
    return this.service.create(input);
  }

  @Mutation(() => JornadaLaboral, {name: 'updateJornadaLaboral'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateJornadaLaboralInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'removeJornadaLaboral'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
