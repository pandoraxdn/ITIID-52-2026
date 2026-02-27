import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {AsistenciaEmpleado} from '../../entities/asistencias-empleados/asistencia-empleado.entity';
import {CreateAsistenciaEmpleadoInput} from '../../dtos/asistenciaEmpleado/create-asistenciaEmpleado.input';
import {UpdateAsistenciaEmpleadoInput} from '../../dtos/asistenciaEmpleado/update-asistenciaEmpleado.input';

@Injectable()
export class AsistenciaEmpleadoService {
  constructor(
    @InjectRepository(AsistenciaEmpleado)
    private repository: Repository<AsistenciaEmpleado>
  ) {}

  async create(data: CreateAsistenciaEmpleadoInput): Promise<AsistenciaEmpleado> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<AsistenciaEmpleado[]> {
    return await this.repository.find();
  }

  async findAllPaginate(page: number = 1, limit: number = 10): Promise<AsistenciaEmpleado[]> {
    const skip = (page - 1) * limit;
    return await this.repository.find({
      skip,
      take: limit,
      order: {id_asistencia_emp: 'ASC'},
    });
  }

  async findOne(id_asistencia_emp: number): Promise<AsistenciaEmpleado> {
    return await this.repository.findOneBy({id_asistencia_emp});
  }

  async update(id_asistencia_emp: number, data: UpdateAsistenciaEmpleadoInput): Promise<AsistenciaEmpleado> {
    data.id_asistencia_emp = id_asistencia_emp;
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_asistencia_emp: ${id_asistencia_emp} not found`);
    }
    return await this.repository.save(register);
  }

  async remove(id_asistencia_emp: number): Promise<boolean> {
    const result = await this.repository.delete({id_asistencia_emp});
    return result.affected ? result.affected > 0 : false;
  }
}
