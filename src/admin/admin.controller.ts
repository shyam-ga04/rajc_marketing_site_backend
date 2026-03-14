import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CompanyDetailsDto } from 'src/dto/company.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/company')
  getCompanyDetails() {
    return this.adminService.getCompany();
  }

  @Post('/company/create')
  @ApiBody({ type: CompanyDetailsDto })
  createCompany(company: CompanyDetailsDto) {
    return this.adminService.createCompany(company);
  }

  @Patch('/company/update/:id')
  @ApiBody({ type: CompanyDetailsDto })
  updateCompany(company: CompanyDetailsDto, @Param('id') id: string) {
    return this.adminService.updateCompany(Number(id), company);
  }
}
