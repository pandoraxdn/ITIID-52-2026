import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {AlumnoTutor} from 'src/sistema-escolar/entities/alumnos-tutores/alumno-tutor.entity';
import {CreateAlumnoTutorInput} from 'src/sistema-escolar/dtos/alumnoTutor/create-alumnoTutor.input';
import {UpdateAlumnoTutorInput} from 'src/sistema-escolar/dtos/alumnoTutor/update-alumnoTutor.input';


@Injectable()
export class AlumnoTutorService {
  constructor(
    @InjectRepository(AlumnoTutor)
    private readonly repository: Repository<AlumnoTutor>,
  ) {}

  async create(data: CreateAlumnoTutorInput): Promise<AlumnoTutor> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<AlumnoTutor[]> {
    return this.repository.find({
      relations: ['alumnos', 'tutores'],
    });
  }

  async findOne(id_de_al_tutor: number): Promise<AlumnoTutor> {
    return await this.repository.findOne({
      where: {id_de_al_tutor},
      relations: ['alumnos', 'tutores'],
    });
  }

  async update(id_de_al_tutor: number, data: UpdateAlumnoTutorInput): Promise<AlumnoTutor> {
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_de_al_tutor: ${id_de_al_tutor} not found`);
    }
    return await this.repository.save(register);
  }

  async remove(id_de_al_tutor: number): Promise<boolean> {
    const result = await this.repository.delete({id_de_al_tutor});
    return result.affected ? result.affected > 0 : false;
  }
}

