import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {MenuComedor} from '../../entities/menus-comedor/menu-comedor.entity';
import {CreateMenuComedorInput} from '../../dtos/menuComedor/create-menuComedor.input';
import {UpdateMenuComedorInput} from '../../dtos/menuComedor/update-menuComedor.input';

@Injectable()
export class MenuComedorService {
  constructor(
    @InjectRepository(MenuComedor)
    private repository: Repository<MenuComedor>
  ) {}

  async create(data: CreateMenuComedorInput): Promise<MenuComedor> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<MenuComedor[]> {
    return await this.repository.find();
  }

  async findAllPaginate(page: number = 1, limit: number = 10): Promise<MenuComedor[]> {
    const skip = (page - 1) * limit;
    return await this.repository.find({
      skip,
      take: limit,
      order: {id_menu: 'ASC'},
    });
  }

  async findOne(id_menu: number): Promise<MenuComedor> {
    return await this.repository.findOneBy({id_menu});
  }

  async update(id_menu: number, data: UpdateMenuComedorInput): Promise<MenuComedor> {
    data.id_menu = id_menu;
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Register with id_menu: ${id_menu} not found`);
    }
    return await this.repository.save(register);
  }

  async remove(id_menu: number): Promise<boolean> {
    const result = await this.repository.delete({id_menu});
    return result.affected ? result.affected > 0 : false;
  }
}
