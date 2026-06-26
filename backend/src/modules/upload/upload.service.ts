import { Injectable, Logger } from "@nestjs/common";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private s3: S3Client | null = null;
  private bucketName: string | null = null;

  constructor() {
    const keyId = process.env.R2_ACCESS_KEY_ID;
    const secret = process.env.R2_SECRET_ACCESS_KEY;
    const endpoint = process.env.R2_ENDPOINT;
    const bucket = process.env.R2_BUCKET_NAME;

    if (keyId && secret && endpoint && bucket && !keyId.startsWith("your-")) {
      try {
        this.s3 = new S3Client({
          region: "auto",
          endpoint: endpoint,
          credentials: {
            accessKeyId: keyId,
            secretAccessKey: secret,
          },
        });
        this.bucketName = bucket;
        this.logger.log("Cloudflare R2 storage initialized");
      } catch (err: any) {
        this.logger.error(`Failed to initialize R2 storage client: ${err.message}`);
      }
    } else {
      this.logger.warn("R2 credentials not fully configured – falling back to local file storage");
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string = "general") {
    const cleanFileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const key = `${folder}/${cleanFileName}`;

    // 1. Upload to Cloudflare R2 if configured
    if (this.s3 && this.bucketName) {
      try {
        await this.s3.send(
          new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          }),
        );
        this.logger.log(`Uploaded file to R2: ${key}`);
        
        // Return R2 public URL (assuming endpoint formats public URL or custom domain cdn)
        const customDomain = process.env.R2_CUSTOM_DOMAIN || "https://cdn.foodcourtos.com";
        return {
          url: `${customDomain}/${key}`,
          filename: cleanFileName,
          size: file.size,
          mimetype: file.mimetype,
        };
      } catch (err: any) {
        this.logger.error(`R2 upload failed: ${err.message}. Falling back to local storage.`);
      }
    }

    // 2. Fallback: upload to local disk
    try {
      const uploadsDir = path.join(process.cwd(), "uploads", folder);
      
      // Ensure folder exists
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, cleanFileName);
      fs.writeFileSync(filePath, file.buffer);
      this.logger.log(`Saved file locally: ${filePath}`);

      // Return local server URL path served by ServeStaticModule
      return {
        url: `/api/uploads/${folder}/${cleanFileName}`,
        filename: cleanFileName,
        size: file.size,
        mimetype: file.mimetype,
      };
    } catch (err: any) {
      this.logger.error(`Local file upload failed: ${err.message}`);
      throw err;
    }
  }

  async deleteFile(url: string) {
    this.logger.log(`Deleting file: ${url}`);

    // Case 1: Local file deletion
    if (url.startsWith("/api/uploads/")) {
      try {
        const relativePath = url.replace("/api/uploads/", "");
        const filePath = path.join(process.cwd(), "uploads", relativePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          this.logger.log(`Deleted local file: ${filePath}`);
        }
        return { success: true };
      } catch (err: any) {
        this.logger.error(`Failed to delete local file: ${err.message}`);
        return { success: false, error: err.message };
      }
    }

    // Case 2: R2/S3 deletion
    if (this.s3 && this.bucketName) {
      try {
        // Extract key from URL
        const cdnDomain = process.env.R2_CUSTOM_DOMAIN || "https://cdn.foodcourtos.com";
        const key = url.replace(`${cdnDomain}/`, "");

        await this.s3.send(
          new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
          }),
        );
        this.logger.log(`Deleted file from R2: ${key}`);
        return { success: true };
      } catch (err: any) {
        this.logger.error(`Failed to delete file from R2: ${err.message}`);
        return { success: false, error: err.message };
      }
    }

    this.logger.warn(`No action taken for deleting URL: ${url}`);
    return { success: true };
  }
}
