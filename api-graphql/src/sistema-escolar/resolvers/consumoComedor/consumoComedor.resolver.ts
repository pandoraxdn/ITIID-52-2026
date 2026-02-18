import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {ConsumoComedor} from '../../entities/consumos-comedor/consumo-comedor.entity';
import {ConsumoComedorService} from '../../services/consumoComedor/consumoComedor.service';
import {CreateConsumoComedorInput} from '../../dtos/consumoComedor/create-consumoComedor.input';
import {UpdateConsumoComedorInput} from '../../dtos/consumoComedor/update-consumoComedor.input';

@Resolver(() => ConsumoComedor)
export class ConsumoComedorResolver {
  constructor(private readonly service: ConsumoComedorService) {}

  @Query(() => [ConsumoComedor], {name: 'consumosComedor'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => ConsumoComedor, {name: 'consumoComedor'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => ConsumoComedor, {name: 'createConsumoComedor'})
  create(@Args('input') input: CreateConsumoComedorInput) {
    return this.service.create(input);
  }

  @Mutation(() => ConsumoComedor, {name: 'updateConceptoPago'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateConsumoComedorInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'deleteConceptoPago'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
