import { config } from 'dotenv';
import { Module } from '@nestjs/common';
import postgres from 'postgres';

// Load Environment Variables
config({
  path: ['.env', '.env.production', '.env.local'],
});

//@ts-ignore
const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

const dbProvider = {
  provide: 'POSTGRES_POOL',
  useValue: sql,
};

@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}
