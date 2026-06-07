import { DataSourceOptions, DataSource } from 'typeorm';

export const AppDataSource = new DataSource(getDataSourceConfig());

export function getDatabaseConfig(): DataSourceOptions {
  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST!,
    port: Number(process.env.DATABASE_PORT!),
    username: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: process.env.DATABASE_SYNCHRONIZE !== 'false',
  };
}

export function getDataSourceConfig(): DataSourceOptions {
  return {
    ...getDatabaseConfig(),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  };
}
