import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [DatabaseModule, AdminModule, AdminModule],
  controllers: [AppController, AdminController, AdminController],
  providers: [AppService, AdminService, AdminService],
})
export class AppModule {}
