import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Inscripcion} from '../../entities/inscripciones/inscripcion.entity';
import {CreateInscripcionInput} from '../../dtos/inscripcion/create-inscripcion.input';
import {UpdateInscripcionInput} from '../../dtos/inscripcion/update-inscripcion.input';

@Injectable()
export class InscripcionService {
  constructor(
    @InjectRepository(Inscripcion)
    private repository: Repository<Inscripcion>
  ) {}

  async create(data: CreateInscripcionInput): Promise<Inscripcion> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<Inscripcion[]> {
    return await this.repository.find();
  }

  async findOne(id_inscripcion: number): Promise<Inscripcion> {
    return await this.repository.findOneBy({id_inscripcion});
  }

  async update(id_inscripcion: number, data: UpdateInscripcionInput): Promise<Inscripcion> {
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_inscripcion: ${id_inscripcion} not found`);
    }
    return await this.repository.save(register);
  }

  async remove(id_inscripcion: number): Promise<boolean> {
    const result = await this.repository.delete({id_inscripcion});
    return result.affected ? result.affected > 0 : false;
  }
}
