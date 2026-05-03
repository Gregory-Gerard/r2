import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import type { Env } from './config.ts';

export type S3 = {
  client: S3Client;
  bucket: string;
};

export const createS3 = (env: Env): S3 => ({
  client: new S3Client({
    region: env.S3_REGION,
    endpoint: env.S3_ENDPOINT,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    },
    forcePathStyle: Boolean(env.S3_ENDPOINT),
  }),
  bucket: env.S3_BUCKET,
});

type PutObjectParams = {
  s3: S3;
  key: string;
  body: Buffer | string;
  contentType: string;
  cacheControl: string;
};

export const putObject = async ({ s3, key, body, contentType, cacheControl }: PutObjectParams) => {
  await s3.client.send(
    new PutObjectCommand({
      Bucket: s3.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: cacheControl,
    }),
  );
};
