import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {GraphQLModule} from '@nestjs/graphql';
import {ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo';
import {join} from 'path';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SistemaEscolarModule} from './sistema-escolar/sistema-escolar.module';
//import {HelloWorldModule} from './hello-world/hello-world.module';
//import {TodoModule} from './todo/todo.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql')
      //playground: false,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: 'najimi',
      password: 'pass',
      database: 'escuela_dsm52',
      synchronize: true,
      autoLoadEntities: true
    }),
    //TodoModule,
    //HelloWorldModule,
    SistemaEscolarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
