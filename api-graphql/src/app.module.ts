import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {GraphQLModule} from '@nestjs/graphql';
import {ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo';
import {join} from 'path';
import {SistemaEscolarModule} from './sistema-escolar/sistema-escolar.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {GraphQLDate} from 'graphql-scalars';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      //playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      buildSchemaOptions: {
        scalarsMap: [
          {type: Date, scalar: GraphQLDate},
        ],
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'najimi',
      password: 'pass',
      database: 'pandora',
      synchronize: true,
      autoLoadEntities: true,
    }),
    SistemaEscolarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
