import { Inject, Injectable } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CompanyDetailsDto } from '../dto/company.dto';
import { UpdateEnquiryDto } from '../dto/enquiry.dto';
import { GoogleDriveService } from '../google-drive/google-drive.service';

@Injectable()
export class AdminService {
  constructor(
    @Inject('POSTGRES_POOL') private readonly sql: any,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  async getCompany(id: number) {
    console.log('[AdminService] getCompany - id:', id);
    const companyData = await this
      .sql`SELECT * FROM company_details WHERE id = ${id};`;
    console.log('[AdminService] getCompany - result:', companyData[0]);
    return companyData[0];
  }

  @ApiBody({ type: CompanyDetailsDto })
  async createCompany(company: CompanyDetailsDto) {
    console.log('[AdminService] createCompany - payload:', company);
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
    console.log('[AdminService] createCompany - result:', result[0]);
    return result[0];
  }

  async uploadCompanyLogo(id: number, file: Express.Multer.File) {
    console.log('[AdminService] uploadCompanyLogo - id:', id, '| filename:', file?.originalname, '| size:', file?.size);
    const existing = await this
      .sql`SELECT logo FROM company_details WHERE id = ${id};`;

    if (existing[0]?.logo) {
      console.log('[AdminService] uploadCompanyLogo - deleting existing logo:', existing[0].logo);
      await this.googleDriveService.deleteFile(existing[0].logo);
    }

    const logoUrl = await this.googleDriveService.uploadBrandLogo(file);
    console.log('[AdminService] uploadCompanyLogo - uploaded logo url:', logoUrl);
    const result = await this
      .sql`UPDATE company_details SET logo = ${logoUrl} WHERE id = ${id} RETURNING *;`;
    console.log('[AdminService] uploadCompanyLogo - result:', result[0]);
    return result[0];
  }

  async getEnquiries() {
    console.log('[AdminService] getEnquiries - fetching all enquiries');
    const result = await this.sql`SELECT * FROM enquiry ORDER BY created_at DESC;`;
    console.log('[AdminService] getEnquiries - total records:', result.length);
    return result;
  }

  async updateEnquiry(id: number, dto: UpdateEnquiryDto) {
    console.log('[AdminService] updateEnquiry - id:', id, '| payload:', dto);
    const result = await this
      .sql`UPDATE enquiry SET status = ${dto.status} WHERE id = ${id} RETURNING *;`;
    console.log('[AdminService] updateEnquiry - result:', result[0]);
    return result[0];
  }

  async updateCompany(id: number, company: CompanyDetailsDto) {
    console.log('[AdminService] updateCompany - id:', id, '| payload:', company);
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
    console.log('[AdminService] updateCompany - result:', result[0]);
    return result[0];
  }
}
