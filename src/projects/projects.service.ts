import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ProjectsService {
  constructor(@Inject('POSTGRES_POOL') private readonly sql: any) {}

  async getProjects(search?: string) {
    console.log('[ProjectsService] getProjects - fetching all projects. Search:', search);
    if (search) {
      return this.sql`
        SELECT * FROM projects 
        WHERE name ILIKE ${'%' + search + '%'} 
           OR location ILIKE ${'%' + search + '%'}
        ORDER BY created_at DESC;
      `;
    }
    return this.sql`SELECT * FROM projects ORDER BY created_at DESC;`;
  }

  async getProjectById(id: string) {
    console.log('[ProjectsService] getProjectById - id:', id);
    const result = await this.sql`SELECT * FROM projects WHERE id = ${id};`;
    return result[0];
  }
}
