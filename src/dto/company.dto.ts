import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CompanyDetailsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  founder_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  founder_degrees?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contact_number?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contact_email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  flat_no?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pin_code?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  Latitude?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  longitude?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  company_summary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  founder_summary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mission?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vision?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  key_milestones?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  company_founded_year?: string;
}
