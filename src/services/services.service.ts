import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ServicesService {
  constructor(@Inject('POSTGRES_POOL') private readonly sql: any) {}

  async getServices() {
    console.log('[ServicesService] getServices - fetching all active services');
    const services = await this.sql`
      SELECT * FROM services WHERE is_active = TRUE ORDER BY created_at DESC;
    `;
    console.log('[ServicesService] getServices - total records:', services.length);

    const results = await Promise.all(
      services.map(async (s: any) => {
        const [scope, processSteps, features] = await Promise.all([
          this.sql`SELECT * FROM service_scope WHERE service_slug = ${s.slug} ORDER BY position;`,
          this.sql`SELECT * FROM service_process_steps WHERE service_slug = ${s.slug} ORDER BY position;`,
          this.sql`SELECT * FROM service_features WHERE service_slug = ${s.slug} ORDER BY position;`,
        ]);
        return { ...s, scope, process_steps: processSteps, features };
      }),
    );

    return results;
  }

  async getServiceBySlug(slug: string) {
    console.log('[ServicesService] getServiceBySlug - slug:', slug);
    const [service] = await this.sql`
      SELECT * FROM services WHERE slug = ${slug} AND is_active = TRUE;
    `;
    if (!service) return null;

    const [scope, processSteps, features] = await Promise.all([
      this.sql`SELECT * FROM service_scope WHERE service_slug = ${slug} ORDER BY position;`,
      this.sql`SELECT * FROM service_process_steps WHERE service_slug = ${slug} ORDER BY position;`,
      this.sql`SELECT * FROM service_features WHERE service_slug = ${slug} ORDER BY position;`,
    ]);

    console.log('[ServicesService] getServiceBySlug - found:', service.slug);
    return { ...service, scope, process_steps: processSteps, features };
  }
}
