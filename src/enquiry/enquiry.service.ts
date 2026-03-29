import { Inject, Injectable } from '@nestjs/common';
import { EnquiryDto } from '../dto/enquiry.dto';

@Injectable()
export class EnquiryService {
  constructor(@Inject('POSTGRES_POOL') private readonly sql: any) {}

  async createEnquiry(enquiry: EnquiryDto) {
    console.log('[EnquiryService] createEnquiry - payload:', enquiry);
    const result = await this.sql`
      INSERT INTO enquiry (
        company_id,
        full_name,
        phone,
        email,
        city,
        budget_rate,
        message
      )
      VALUES (
        ${enquiry.company_id},
        ${enquiry.full_name},
        ${enquiry.phone},
        ${enquiry.email},
        ${enquiry.city},
        ${enquiry.budget_rate},
        ${enquiry.message}
      )
      RETURNING *;
    `;
    console.log('[EnquiryService] createEnquiry - result:', result[0]);
    return result[0];
  }
}
