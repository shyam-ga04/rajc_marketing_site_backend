import { Inject, Injectable } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CompanyDetailsDto } from '../dto/company.dto';
import { UpdateEnquiryDto } from '../dto/enquiry.dto';
import { CreateServiceDto, UpdateServiceDto } from '../dto/services.dto';
import { CreateProjectDto, UpdateProjectDto } from '../dto/projects.dto';
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

  // ─── Services CRUD ───────────────────────────────────────────────────────────

  private async fetchServiceWithRelations(slug: string) {
    const [service, scope, processSteps, features] = await Promise.all([
      this.sql`SELECT * FROM services WHERE slug = ${slug};`,
      this.sql`SELECT * FROM service_scope WHERE service_slug = ${slug} ORDER BY position;`,
      this.sql`SELECT * FROM service_process_steps WHERE service_slug = ${slug} ORDER BY position;`,
      this.sql`SELECT * FROM service_features WHERE service_slug = ${slug} ORDER BY position;`,
    ]);
    return { ...service[0], scope, process_steps: processSteps, features };
  }

  async getAllServices() {
    console.log('[AdminService] getAllServices - fetching all services');
    const services = await this.sql`SELECT * FROM services ORDER BY created_at DESC;`;
    console.log('[AdminService] getAllServices - total records:', services.length);

    const results = await Promise.all(
      services.map((s: any) => this.fetchServiceWithRelations(s.slug)),
    );
    return results;
  }

  async getServiceBySlug(slug: string) {
    console.log('[AdminService] getServiceBySlug - slug:', slug);
    const result = await this.fetchServiceWithRelations(slug);
    console.log('[AdminService] getServiceBySlug - result:', result?.slug);
    return result;
  }

  async createService(dto: CreateServiceDto) {
    console.log('[AdminService] createService - payload:', dto);

    const [service] = await this.sql`
      INSERT INTO services (slug, name, short_description, full_description, ideal_for, is_active)
      VALUES (
        ${dto.slug},
        ${dto.name},
        ${dto.short_description},
        ${dto.full_description ?? ''},
        ${dto.ideal_for ?? ''},
        ${dto.is_active ?? true}
      )
      RETURNING *;
    `;
    console.log('[AdminService] createService - service inserted:', service.slug);

    if (dto.scope?.length) {
      await this.sql`
        INSERT INTO service_scope ${this.sql(
          dto.scope.map((s) => ({ service_slug: dto.slug, description: s.description, position: s.position })),
        )};
      `;
    }

    if (dto.process_steps?.length) {
      await this.sql`
        INSERT INTO service_process_steps ${this.sql(
          dto.process_steps.map((s) => ({ service_slug: dto.slug, title: s.title, description: s.description, position: s.position })),
        )};
      `;
    }

    if (dto.features?.length) {
      await this.sql`
        INSERT INTO service_features ${this.sql(
          dto.features.map((f) => ({ service_slug: dto.slug, title: f.title, icon: f.icon, position: f.position })),
        )};
      `;
    }

    const result = await this.fetchServiceWithRelations(dto.slug);
    console.log('[AdminService] createService - completed:', result.slug);
    return result;
  }

  async updateService(slug: string, dto: UpdateServiceDto) {
    console.log('[AdminService] updateService - slug:', slug, '| payload:', dto);

    const { scope, process_steps, features, ...serviceFields } = dto;

    if (Object.keys(serviceFields).length) {
      await this.sql`
        UPDATE services SET ${this.sql(serviceFields)}, updated_at = CURRENT_TIMESTAMP
        WHERE slug = ${slug};
      `;
    }

    if (scope !== undefined) {
      await this.sql`DELETE FROM service_scope WHERE service_slug = ${slug};`;
      if (scope.length) {
        await this.sql`
          INSERT INTO service_scope ${this.sql(
            scope.map((s) => ({ service_slug: slug, description: s.description, position: s.position })),
          )};
        `;
      }
    }

    if (process_steps !== undefined) {
      await this.sql`DELETE FROM service_process_steps WHERE service_slug = ${slug};`;
      if (process_steps.length) {
        await this.sql`
          INSERT INTO service_process_steps ${this.sql(
            process_steps.map((s) => ({ service_slug: slug, title: s.title, description: s.description, position: s.position })),
          )};
        `;
      }
    }

    if (features !== undefined) {
      await this.sql`DELETE FROM service_features WHERE service_slug = ${slug};`;
      if (features.length) {
        await this.sql`
          INSERT INTO service_features ${this.sql(
            features.map((f) => ({ service_slug: slug, title: f.title, icon: f.icon, position: f.position })),
          )};
        `;
      }
    }

    const result = await this.fetchServiceWithRelations(slug);
    console.log('[AdminService] updateService - completed:', result.slug);
    return result;
  }

  async deleteService(slug: string) {
    console.log('[AdminService] deleteService - slug:', slug);
    const result = await this.sql`DELETE FROM services WHERE slug = ${slug} RETURNING *;`;
    console.log('[AdminService] deleteService - deleted:', result[0]?.slug);
    return { message: `Service '${slug}' deleted successfully`, deleted: result[0] };
  }

  // ─── Projects CRUD ───────────────────────────────────────────────────────────

  async getAllProjects(search?: string) {
    console.log('[AdminService] getAllProjects - search:', search);
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
    console.log('[AdminService] getProjectById - id:', id);
    const result = await this.sql`SELECT * FROM projects WHERE id = ${id};`;
    return result[0];
  }

  async createProject(dto: CreateProjectDto) {
    console.log('[AdminService] createProject - payload:', dto);
    const result = await this.sql`
      INSERT INTO projects ${this.sql(dto)}
      RETURNING *;
    `;
    console.log('[AdminService] createProject - result:', result[0]?.id);
    return result[0];
  }

  async updateProject(id: string, dto: UpdateProjectDto) {
    console.log('[AdminService] updateProject - id:', id, '| payload:', dto);
    const { id: _, ...updateData } = dto;
    const result = await this.sql`
      UPDATE projects SET ${this.sql(updateData)}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *;
    `;
    console.log('[AdminService] updateProject - result:', result[0]?.id);
    return result[0];
  }

  async deleteProject(id: string) {
    console.log('[AdminService] deleteProject - id:', id);
    const result = await this.sql`DELETE FROM projects WHERE id = ${id} RETURNING *;`;
    return { message: `Project with id '${id}' deleted successfully`, deleted: result[0] };
  }
}
