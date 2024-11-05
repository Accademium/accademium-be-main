import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
    private readonly s3Client: S3Client;
    private readonly bucketName: string;
    private readonly logger = new Logger(S3Service.name);
  
    constructor(
        private configService: ConfigService
    ) {
      this.s3Client = new S3Client({
        region: this.configService.get<string>('aws.region'),
        credentials: {
          accessKeyId: this.configService.get<string>('aws.accessKeyId'),
          secretAccessKey: this.configService.get<string>('aws.secretAccessKey'),
        },
      });
      this.bucketName = this.configService.get<string>('aws.bucketName');
    }
  

    /**
     * Uploads a file to the specified S3 bucket with metadata for user and mentor access.
     *
     * @param {Buffer} buffer - The file content to be uploaded as a Buffer.
     * @param {string} key - The unique key (file path) for storing the file in S3.
     * @param {string} mimetype - The MIME type of the file.
     * @param {string} userId - The ID of the user who owns the file.
     * @param {string} mentorId - The ID of the mentor with access to the file.
     * @returns {string} - The S3 key of the uploaded file.
     * @throws {Error} - Throws an error if the upload fails.
     */
    async uploadFile(
        buffer: Buffer,
        key: string,
        mimetype: string,
        userId: string,
        mentorId: string,
    ): Promise<string> {
        try {
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: key,
                    Body: buffer,
                    ContentType: mimetype,
                    Metadata: {
                    userId,
                    mentorId,
                    },
                    ACL: 'private',
              }),
            );
      
            this.logger.log(`Document uploaded: ${key}`);
            return key;
        } catch (error) {
            this.logger.error(`Failed to upload document: ${error.message}`);
            throw error; //TODO thow better exception
        }
    }

    /**
     * Generates a signed URL for accessing a file in S3 if the requesting user is authorized.
     * Only the user who owns the file or their mentor can access the signed URL.
     *
     * @param {string} key - The unique key (file path) for retrieving the file from S3.
     * @param {string} requestingUserId - The ID of the user requesting access to the file.
     * @param {number} expirationInSeconds - Optional. The expiration time of the signed URL in seconds (default is 3600 seconds).
     * @returns {string} - The generated signed URL for accessing the file.
     * @throws {UnauthorizedException} - Throws if the requesting user does not have permission to access the file.
     * @throws {Error} - Throws if the signed URL generation fails.
     */
    async getSignedUrl(
        key: string,
        requestingUserId: string,
        expirationInSeconds: number = 3600,
    ): Promise<string> {
        try {
            const headCommand = new HeadObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });
            const metadata = await this.s3Client.send(headCommand);

            const { userId, mentorId } = metadata.Metadata || {};

            if (requestingUserId !== userId && requestingUserId !== mentorId) {
                throw new UnauthorizedException('You do not have access to this document.');
            }

            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });
            const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: expirationInSeconds });

            this.logger.log(`Generated signed URL for document: ${key}`);
            return signedUrl;
        } catch (error) {
            this.logger.error(`Failed to generate signed URL: ${error.message}`);
            throw error;
        }
    }
}
