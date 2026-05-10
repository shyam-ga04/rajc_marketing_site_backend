import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiQuery({ name: 'search', required: false })
  getProjects(@Query('search') search?: string) {
    return this.projectsService.getProjects(search);
  }

  @Get('/:id')
  getProjectById(@Param('id') id: string) {
    return this.projectsService.getProjectById(id);
  }
}
