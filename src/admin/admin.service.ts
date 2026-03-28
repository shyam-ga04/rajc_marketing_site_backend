import { Inject, Injectable } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CompanyDetailsDto } from '../dto/company.dto';

@Injectable()
export class AdminService {
  constructor(@Inject('POSTGRES_POOL') private readonly sql: any) {}

  async getCompany(id: number) {
    const companyData = await this
      .sql`SELECT * FROM company_details WHERE id = ${id};`;
    return companyData[0];
  }

  @ApiBody({ type: CompanyDetailsDto })
  async createCompany(company: CompanyDetailsDto) {
    const result = await this.sql`
    INSERT INTO company_details (
      founder_name,
      founder_degrees,
      contact_number,
      contact_email,
      flat_no,
      address,
      city,
      country,
      pin_code,
      Latitude,
      longitude,
      company_summary,
      founder_summary,
      mission,
      vision,
      key_milestones,
      company_founded_year
    )
    VALUES (
      ${company.founder_name},
      ${company.founder_degrees},
      ${company.contact_number},
      ${company.contact_email},
      ${company.flat_no},
      ${company.address},
      ${company.city},
      ${company.country},
      ${company.pin_code},
      ${company.Latitude},
      ${company.longitude},
      ${company.company_summary},
      ${company.founder_summary},
      ${company.mission},
      ${company.vision},
      ${company.key_milestones},
      ${company.company_founded_year}
    )
    RETURNING *;
  `;

    return result[0];
  }

  async updateCompany(id: number, company: CompanyDetailsDto) {
    console.log({ id, company });
    const keyLength = Object.keys(company).length;

    let setQuery = '';

    Object.entries(company).map(([key, value], index) => {
      if (index + 1 < keyLength) {
        setQuery += `${key} = '${value}', `;
      } else {
        setQuery += `${key} = '${value}'`;
      }
    });

    const result = await this
      .sql`UPDATE company_details SET ${this.sql(company)} WHERE id = ${id} RETURNING *;`;
    return result[0];
  }
}
