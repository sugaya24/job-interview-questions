import { s3Client } from '@/s3/s3Client';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { filename, extension } = req.query;
    const key = Array.isArray(filename)
      ? `${filename[0]}.${extension}`
      : `${filename}.${extension}`;
    const post = await createPresignedPost(s3Client, {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Expires: 600,
    });
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
