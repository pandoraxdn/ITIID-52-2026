import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {AsistenciaAlumno} from 'src/sistema-escolar/entities';
import {CreateAsistenciaAlumnoInput} from 'src/sistema-escolar/dtos/asistenciaAlumno/create-asistenciaAlumno.input';
import {UpdateAsistenciaAlumnoInput} from 'src/sistema-escolar/dtos/asistenciaAlumno/update-asistenciaAlumno.input';

@Injectable()
export class AsistenciaAlumnoService {
  constructor(
    @InjectRepository(AsistenciaAlumno)
    private repository: Repository<AsistenciaAlumno>
  ) {}

  async create(data: CreateAsistenciaAlumnoInput): Promise<AsistenciaAlumno> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<AsistenciaAlumno[]> {
    return await this.repository.find();
  }

  async findAllPaginate(page: number = 1, limit: number = 10): Promise<AsistenciaAlumno[]> {
    const skip = (page - 1) * limit;
    return await this.repository.find({
      skip,
      take: limit,
      order: {id_asistencia_al: 'ASC'},
    });
  }

  async findOne(id_asistencia_al: number): Promise<AsistenciaAlumno> {
    return await this.repository.findOneBy({id_asistencia_al});
  }

  async update(id_asistencia_al: number, data: UpdateAsistenciaAlumnoInput): Promise<AsistenciaAlumno> {
    data.id_asistencia_al = id_asistencia_al;
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_asistencia_al: ${id_asistencia_al} not found`);
    }
    return this.repository.save(register);
  }

  async remove(id_asistencia_al: number): Promise<boolean> {
    const result = await this.repository.delete({id_asistencia_al});
    return result.affected ? result.affected > 0 : false;
  }
}
