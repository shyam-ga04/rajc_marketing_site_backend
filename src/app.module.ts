import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { GoogleDriveService } from './google-drive/google-drive.service';
import { EnquiryModule } from './enquiry/enquiry.module';
import { EnquiryController } from './enquiry/enquiry.controller';
import { EnquiryService } from './enquiry/enquiry.service';
import { ServicesModule } from './services/services.module';
import { ServicesController } from './services/services.controller';
import { ServicesService } from './services/services.service';
import { ProjectsModule } from './projects/projects.module';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsService } from './projects/projects.service';

@Module({
  imports: [
    DatabaseModule,
    AdminModule,
    EnquiryModule,
    ServicesModule,
    ProjectsModule,
  ],
  controllers: [
    AppController,
    AdminController,
    EnquiryController,
    ServicesController,
    ProjectsController,
  ],
  providers: [
    AppService,
    AdminService,
    GoogleDriveService,
    EnquiryService,
    ServicesService,
    ProjectsService,
  ],
})
export class AppModule {}
