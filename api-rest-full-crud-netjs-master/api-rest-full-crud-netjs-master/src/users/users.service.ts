import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('PG') private pool: Pool) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email } = createUserDto;
    const result = await this.pool.query(
      `INSERT INTO users (name, email)
       VALUES ($1, $2) RETURNING *`,
      [name, email],
    );
    return result.rows[0];
  }

  async findAll() {
    const result = await this.pool.query(`SELECT * FROM users ORDER BY id ASC`);
    return result.rows;
  }

  async findOne(id: string) {
    const result = await this.pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return result.rows[0];
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { name, email } = updateUserDto;
    const result = await this.pool.query(
      `UPDATE users
       SET name = $1, email = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [name, email, id],
    );
    if (result.rows.length === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return result.rows[0];
  }

  async remove(id: string) {
    const result = await this.pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,
      [id],
    );
    if (result.rows.length === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { deleted: true };
  }
}

