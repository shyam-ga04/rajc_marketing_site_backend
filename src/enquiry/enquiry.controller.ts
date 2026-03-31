import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { EnquiryService } from './enquiry.service';
import { EnquiryDto } from '../dto/enquiry.dto';

@Controller('enquiry')
export class EnquiryController {
  constructor(private readonly enquiryService: EnquiryService) {}

  @Post('/create')
  @ApiBody({ type: EnquiryDto })
  createEnquiry(@Body() enquiry: EnquiryDto) {
    return this.enquiryService.createEnquiry(enquiry);
  }
}
