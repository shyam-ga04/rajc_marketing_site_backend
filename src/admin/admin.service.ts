import { Inject, Injectable } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CompanyDetailsDto } from '../dto/company.dto';

@Injectable()
export class AdminService {
  constructor(@Inject('POSTGRES_POOL') private readonly sql: any) {}

  async getCompany() {
    const companyData = await this.sql`SELECT * FROM company_details;`;
    return companyData;
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
    const fields = Object.keys(company);

    if (fields.length === 0) {
      throw new Error('No fields provided for update');
    }

    const setQuery = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(', ');

    const values = fields.map((field) => (company as any)[field]);

    const query = `
    UPDATE company_details
    SET ${setQuery}
    WHERE id = $${fields.length + 1}
    RETURNING *;
  `;

    const result = await this.sql.unsafe(query, [...values, id]);

    return result[0];
  }
}
