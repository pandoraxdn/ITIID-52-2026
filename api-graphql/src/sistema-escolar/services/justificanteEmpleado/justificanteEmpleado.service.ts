import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {JustificanteEmpleado} from '../../entities/justificantes-empleados/justificante-empleado.entity';
import {CreateJustificanteEmpleadoInput} from '../../dtos/justificanteEmpleado/create-justificanteEmpleado.input';
import {UpdateJustificanteEmpleadoInput} from '../../dtos/justificanteEmpleado/update-justificanteEmpleado.input';

@Injectable()
export class JustificanteEmpleadoService {
  constructor(
    @InjectRepository(JustificanteEmpleado)
    private repository: Repository<JustificanteEmpleado>
  ) {}

  async create(data: CreateJustificanteEmpleadoInput): Promise<JustificanteEmpleado> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<JustificanteEmpleado[]> {
    return await this.repository.find();
  }

  async findOne(id_justificante_emp: number): Promise<JustificanteEmpleado> {
    return await this.repository.findOneBy({id_justificante_emp});
  }

  async update(id_justificante_emp: number, data: UpdateJustificanteEmpleadoInput): Promise<JustificanteEmpleado> {
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_justificante_emp: ${id_justificante_emp} not found`);
    }
    return await this.repository.save(register);
  }

  async remove(id_justificante_emp: number): Promise<boolean> {
    const result = await this.repository.delete({id_justificante_emp});
    return result.affected ? result.affected > 0 : false;
  }
}
