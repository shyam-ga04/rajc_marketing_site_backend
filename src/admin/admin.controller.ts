import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { AdminService } from './admin.service';
import { CompanyDetailsDto } from '../dto/company.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/enquiry')
  getEnquiries() {
    return this.adminService.getEnquiries();
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
}
