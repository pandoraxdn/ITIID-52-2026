import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Tutor} from '../../entities/tutores/tutor.entity';
import {CreateTutorInput} from '../../dtos/tutor/create-tutor.input';
import {UpdateTutorInput} from '../../dtos/tutor/update-tutor.input';

@Injectable()
export class TutorService {
  constructor(
    @InjectRepository(Tutor)
    private repository: Repository<Tutor>
  ) {}

  async create(data: CreateTutorInput): Promise<Tutor> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<Tutor[]> {
    return await this.repository.find();
  }

  async findAllPaginate(page: number = 1, limit: number = 10): Promise<Tutor[]> {
    const skip = (page - 1) * limit;
    return await this.repository.find({
      skip,
      take: limit,
      order: {id_tutor: 'ASC'},
    });
  }

  async findOne(id_tutor: number): Promise<Tutor> {
    return await this.repository.findOneBy({id_tutor});
  }

  async update(id_tutor: number, data: UpdateTutorInput): Promise<Tutor> {
    data.id_tutor = id_tutor;
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_tutor: ${id_tutor} not found`);
    }
    return await this.repository.save(register);
  }

  async remove(id_tutor: number): Promise<boolean> {
    const result = await this.repository.delete({id_tutor});
    return result.affected ? result.affected > 0 : false;
  }
}
