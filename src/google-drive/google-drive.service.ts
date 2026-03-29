import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { Readable } from 'stream';
import { extname } from 'path';

@Injectable()
export class GoogleDriveService {
  private drive;

  constructor() {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    this.drive = google.drive({ version: 'v3', auth: oauth2Client });
  }

  async uploadBrandLogo(file: Express.Multer.File): Promise<string> {
    const ext = extname(file.originalname);
    const fileMetadata: any = { name: `brand_logo${ext}` };

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (folderId) {
      fileMetadata.parents = [folderId];
    }

    const response = await this.drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: file.mimetype,
        body: Readable.from(file.buffer),
      },
      fields: 'id',
    });

    const fileId = response.data.id;

    await this.drive.permissions.create({
      fileId,
      requestBody: { role: 'reader', type: 'anyone' },
    });

    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const url = new URL(fileUrl);
    const fileId = url.searchParams.get('id');
    if (!fileId) return;
    await this.drive.files.delete({ fileId });
  }
}
