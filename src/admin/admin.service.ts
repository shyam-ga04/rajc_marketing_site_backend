import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  constructor(@Inject('POSTGRES_POOL') private readonly sql: any) {}

  async getCompany() {
    const companyData = await this.sql`SELECT * FROM company_details;`;
    return companyData;
  }

  async createCompany(){
    
  }
}
