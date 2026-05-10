import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { AdminService } from './admin.service';
import { CompanyDetailsDto } from '../dto/company.dto';
import { UpdateEnquiryDto } from '../dto/enquiry.dto';
import { CreateServiceDto, UpdateServiceDto } from '../dto/services.dto';
import { CreateProjectDto, UpdateProjectDto } from '../dto/projects.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/enquiry')
  getEnquiries() {
    return this.adminService.getEnquiries();
  }

  @Patch('/enquiry/update/:id')
  @ApiBody({ type: UpdateEnquiryDto })
  updateEnquiry(@Param('id') id: string, @Body() dto: UpdateEnquiryDto) {
    return this.adminService.updateEnquiry(Number(id), dto);
  }

  @Get('/company/:id')
  getCompanyDetails(@Param('id') id: number) {
    return this.adminService.getCompany(id);
  }

  @Post('/company/create')
  @ApiBody({ type: CompanyDetailsDto })
  createCompany(@Body() company: CompanyDetailsDto) {
    return this.adminService.createCompany(company);
  }

  @Patch('/company/update/:id')
  @ApiBody({ type: CompanyDetailsDto })
  updateCompany(@Body() company: CompanyDetailsDto, @Param('id') id: string) {
    return this.adminService.updateCompany(Number(id), company);
  }

  @Post('/company/upload-logo/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        logo: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('logo', { storage: memoryStorage() }))
  uploadLogo(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.adminService.uploadCompanyLogo(Number(id), file);
  }

  // ─── Services CRUD ───────────────────────────────────────────────────────────

  @Get('/services')
  getAllServices() {
    return this.adminService.getAllServices();
  }

  @Get('/services/:slug')
  getServiceBySlug(@Param('slug') slug: string) {
    return this.adminService.getServiceBySlug(slug);
  }

  @Post('/services/create')
  @ApiBody({ type: CreateServiceDto })
  createService(@Body() dto: CreateServiceDto) {
    return this.adminService.createService(dto);
  }

  @Patch('/services/update/:slug')
  @ApiBody({ type: UpdateServiceDto })
  updateService(@Param('slug') slug: string, @Body() dto: UpdateServiceDto) {
    return this.adminService.updateService(slug, dto);
  }

  @Delete('/services/delete/:slug')
  deleteService(@Param('slug') slug: string) {
    return this.adminService.deleteService(slug);
  }

  // ─── Projects CRUD ───────────────────────────────────────────────────────────

  @Get('/projects')
  @ApiQuery({ name: 'search', required: false })
  getAllProjects(@Query('search') search?: string) {
    return this.adminService.getAllProjects(search);
  }

  @Get('/projects/:id')
  getProjectById(@Param('id') id: string) {
    return this.adminService.getProjectById(id);
  }

  @Post('/projects/create')
  @ApiBody({ type: CreateProjectDto })
  createProject(@Body() dto: CreateProjectDto) {
    return this.adminService.createProject(dto);
  }

  @Patch('/projects/update/:id')
  @ApiBody({ type: UpdateProjectDto })
  updateProject(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.adminService.updateProject(id, dto);
  }

  @Delete('/projects/delete/:id')
  deleteProject(@Param('id') id: string) {
    return this.adminService.deleteProject(id);
  }
}
