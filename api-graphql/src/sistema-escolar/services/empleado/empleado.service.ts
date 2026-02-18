import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Empleado} from '../../entities/empleados/empleado.entity';
import {CreateEmpleadoInput} from '../../dtos/empleado/create-empleado.input';
import {UpdateEmpleadoInput} from '../../dtos/empleado/update-empleado.input';

@Injectable()
export class EmpleadoService {
  constructor(
    @InjectRepository(Empleado)
    private repository: Repository<Empleado>
  ) {}

  async create(data: CreateEmpleadoInput): Promise<Empleado> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<Empleado[]> {
    return await this.repository.find();
  }

  async findOne(id_empleado: number): Promise<Empleado> {
    return await this.repository.findOneBy({id_empleado});
  }

  async update(id_empleado: number, data: UpdateEmpleadoInput): Promise<Empleado> {
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_empleado: ${id_empleado} not found`);
    }
    return await this.repository.save(register);
  }

  async remove(id_empleado: number): Promise<boolean> {
    const result = await this.repository.delete({id_empleado});
    return result.affected ? result.affected > 0 : false;
  }
}
