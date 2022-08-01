import Tag from '@/models/Tag';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.status(400);
  }

  try {
    const tagsList = await Tag.find();
    res.status(200).json(tagsList);
  } catch {
    res.status(400);
  }
}
