import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export enum ProjectStatus {
  IN_PROGRESS = 'in-progress',
  AVAILABLE_FOR_RENT = 'available for rent',
  SOLD = 'sold',
}

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiPropertyOptional({ enum: ProjectStatus, default: ProjectStatus.IN_PROGRESS })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  price?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  square_feet?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  timeline?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  overview?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  client_goal?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  challenge?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  solution?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  outcome?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image_url?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image_alt?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  gallery_urls?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  scope?: string[];
}

export class UpdateProjectDto extends CreateProjectDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  id?: string;
}
