import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {MenuComedor} from '../../entities/menus-comedor/menu-comedor.entity';
import {MenuComedorService} from '../../services/menuComedor/menuComedor.service';
import {CreateMenuComedorInput} from '../../dtos/menuComedor/create-menuComedor.input';
import {UpdateMenuComedorInput} from '../../dtos/menuComedor/update-menuComedor.input';

@Resolver(() => MenuComedor)
export class MenuComedorResolver {
  constructor(private readonly service: MenuComedorService) {}

  @Query(() => [MenuComedor], {name: 'menusComedor'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => MenuComedor, {name: 'menuComedor'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => MenuComedor, {name: 'createMenuComedor'})
  create(@Args('input') input: CreateMenuComedorInput) {
    return this.service.create(input);
  }

  @Mutation(() => MenuComedor, {name: 'updateMenuComedor'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateMenuComedorInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'deleteMenucComedor'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
