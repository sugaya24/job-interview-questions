import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { key } = req.query;
    const s3ObjectUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.MY_AWS_REGION}.amazonaws.com/${key}`;
    res.status(200).json({ s3ObjectUrl });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
