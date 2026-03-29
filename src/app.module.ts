import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { GoogleDriveService } from './google-drive/google-drive.service';

@Module({
  imports: [DatabaseModule, AdminModule],
  controllers: [AppController, AdminController],
  providers: [AppService, AdminService, GoogleDriveService],
})
export class AppModule {}
