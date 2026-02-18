import {Query, Resolver} from '@nestjs/graphql';

@Resolver()
export class SistemaEscolarResolver {
  @Query(() => String, {description: "Hola mundo es lo que retorna", name: "hello"})
  helloWorld(): string {
    return "Hello World";
  }
}
