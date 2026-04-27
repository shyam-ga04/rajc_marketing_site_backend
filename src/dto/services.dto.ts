import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ServiceScopeDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  position: number;
}

export class ServiceProcessStepDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  position: number;
}

export class ServiceFeatureDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  icon: string;

  @ApiProperty()
  @IsNumber()
  position: number;
}

export class CreateServiceDto {
  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  short_description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  full_description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ideal_for?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({ type: [ServiceScopeDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceScopeDto)
  scope?: ServiceScopeDto[];

  @ApiPropertyOptional({ type: [ServiceProcessStepDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceProcessStepDto)
  process_steps?: ServiceProcessStepDto[];

  @ApiPropertyOptional({ type: [ServiceFeatureDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceFeatureDto)
  features?: ServiceFeatureDto[];
}

export class UpdateServiceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  short_description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  full_description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ideal_for?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({ type: [ServiceScopeDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceScopeDto)
  scope?: ServiceScopeDto[];

  @ApiPropertyOptional({ type: [ServiceProcessStepDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceProcessStepDto)
  process_steps?: ServiceProcessStepDto[];

  @ApiPropertyOptional({ type: [ServiceFeatureDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceFeatureDto)
  features?: ServiceFeatureDto[];
}
