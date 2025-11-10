import { Module } from '@nestjs/common';
import { Pool } from 'pg';

const dbProvider = {
  provide: 'PG',
  useFactory: async () => {
    const pool = new Pool({
      user: 'postgres',           
      host: 'localhost',          
      database: 'tp6',  
      password: 'postgres',       
      port: 5432,           
    });
    return pool;
  },
};

@Module({
  providers: [dbProvider],
  exports: ['PG'],
})
export class DatabaseModule {}
