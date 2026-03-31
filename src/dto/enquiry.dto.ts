import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateEnquiryDto {
  @ApiProperty({ enum: ['New', 'In Progress', 'Resolved'] })
  @IsIn(['New', 'In Progress', 'Resolved'])
  status: string;
}

export class EnquiryDto {
  @ApiProperty()
  @IsNumber()
  company_id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  budget_rate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  message?: string;
}
