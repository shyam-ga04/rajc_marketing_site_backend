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

@Module({
  imports: [DatabaseModule, AdminModule, EnquiryModule],
  controllers: [AppController, AdminController, EnquiryController],
  providers: [AppService, AdminService, GoogleDriveService, EnquiryService],
})
export class AppModule {}
