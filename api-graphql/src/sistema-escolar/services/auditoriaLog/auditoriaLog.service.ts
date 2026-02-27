import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {AuditoriaLog} from '../../entities/auditorias-log/auditoria.entity';
import {CreateAuditoriaLogInput} from '../../dtos/auditoriaLog/create-auditoriaLog.input';
import {UpdateAuditoriaLogInput} from '../../dtos/auditoriaLog/update-auditoriaLog.input';

@Injectable()
export class AuditoriaLogService {
  constructor(
    @InjectRepository(AuditoriaLog)
    private repository: Repository<AuditoriaLog>
  ) {}

  async create(data: CreateAuditoriaLogInput): Promise<AuditoriaLog> {
    const register = this.repository.create(data);
    return this.repository.save(register);
  }

  async findAll(): Promise<AuditoriaLog[]> {
    return await this.repository.find();
  }

  async findAllPaginate(page: number = 1, limit: number = 10): Promise<AuditoriaLog[]> {
    const skip = (page - 1) * limit;
    return await this.repository.find({
      skip,
      take: limit,
      order: {id_log: 'ASC'},
    });
  }

  async findOne(id_log: number): Promise<AuditoriaLog> {
    return await this.repository.findOneBy({id_log});
  }

  async update(id_log: number, data: UpdateAuditoriaLogInput): Promise<AuditoriaLog> {
    data.id_log = id_log;
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_log: ${id_log} not found`);
    }
    return await this.repository.save(register);
  }

  async remove(id_log: number): Promise<boolean> {
    const result = await this.repository.delete({id_log});
    return result.affected ? result.affected > 0 : false;
  }
}
