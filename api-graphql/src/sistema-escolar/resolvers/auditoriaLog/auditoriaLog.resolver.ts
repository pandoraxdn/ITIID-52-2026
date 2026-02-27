import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {AuditoriaLog} from '../../entities/auditorias-log/auditoria.entity';
import {AuditoriaLogService} from '../../services/auditoriaLog/auditoriaLog.service';
import {CreateAuditoriaLogInput} from '../../dtos/auditoriaLog/create-auditoriaLog.input';
import {UpdateAuditoriaLogInput} from '../../dtos/auditoriaLog/update-auditoriaLog.input';

@Resolver(() => AuditoriaLog)
export class AuditoriaLogResolver {
  constructor(private readonly service: AuditoriaLogService) {}

  @Query(() => [AuditoriaLog], {name: 'auditoriasLog'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => [AuditoriaLog], {name: 'auditoriasLogP'})
  findAllPaginate(
    @Args('page', {type: () => Int, nullable: true, defaultValue: 1}) page: number,
    @Args('limit', {type: () => Int, nullable: true, defaultValue: 10}) limit: number,
  ) {
    return this.service.findAllPaginate(page, limit);
  }

  @Query(() => AuditoriaLog, {name: 'auditoriaLog'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => AuditoriaLog, {name: 'createAuditoriaLog'})
  create(@Args('input') input: CreateAuditoriaLogInput) {
    return this.service.create(input);
  }

  @Mutation(() => AuditoriaLog, {name: 'updateAuditoriaLog'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateAuditoriaLogInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'removeAuditoriaLog'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
