import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {Tutor} from '../../entities/tutores/tutor.entity';
import {TutorService} from '../../services/tutor/tutor.service';
import {CreateTutorInput} from '../../dtos/tutor/create-tutor.input';
import {UpdateTutorInput} from '../../dtos/tutor/update-tutor.input';

@Resolver(() => Tutor)
export class TutorResolver {
  constructor(private readonly service: TutorService) {}

  @Query(() => [Tutor], {name: 'tutores'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => Tutor, {name: 'tutor'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => Tutor, {name: 'createTutor'})
  create(@Args('input') input: CreateTutorInput) {
    return this.service.create(input);
  }

  @Mutation(() => Tutor, {name: 'updateTutor'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateTutorInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Tutor, {name: 'deleteTutor'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
