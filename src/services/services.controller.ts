import { Controller, Get, Param } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  getServices() {
    return this.servicesService.getServices();
  }

  @Get('/:slug')
  getServiceBySlug(@Param('slug') slug: string) {
    return this.servicesService.getServiceBySlug(slug);
  }
}
