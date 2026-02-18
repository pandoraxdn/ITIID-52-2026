import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Alumno} from 'src/sistema-escolar/entities';
import {CreateAlumnoInput} from 'src/sistema-escolar/dtos/alumno/create-alumno.input';
import {UpdateAlumnoInput} from 'src/sistema-escolar/dtos/alumno/update-alumno.input';

@Injectable()
export class AlumnoService {
  constructor(
    @InjectRepository(Alumno)
    private repository: Repository<Alumno>
  ) {}

  async create(data: CreateAlumnoInput): Promise<Alumno> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<Alumno[]> {
    return await this.repository.find();
  }

  async findOne(id_alumno: number): Promise<Alumno> {
    return await this.repository.findOneBy({id_alumno});
  }

  async update(id_alumno: number, data: UpdateAlumnoInput): Promise<Alumno> {
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Not found id_alumno: ${id_alumno}`);
    }
    return await this.repository.save(register);
  }

  async remove(id_alumno: number): Promise<boolean> {
    const result = await this.repository.delete({id_alumno});
    return result.affected ? result.affected > 0 : false;
  }
}
