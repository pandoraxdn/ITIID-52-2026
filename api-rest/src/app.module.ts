import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TodoModule} from './todo/todo.module';
import {TareaModule} from './tarea/tarea.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Tarea} from './tarea/entities/tarea.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mssql",
      port: 1433,
      host: "localhost",
      username: "sa",
      password: "P@ss1234",
      database: "dsm52",
      entities: [Tarea],
      synchronize: true,
      autoLoadEntities: true,
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
    }),
    TodoModule,
    TareaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
