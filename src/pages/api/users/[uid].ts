import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { NextApiRequest, NextApiResponse } from 'next/types';

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect();
  const { method, query } = req;

  switch (method) {
    case 'GET':
      try {
        const user = await User.findOne({ uid: query.uid });
        if (user) {
          res.status(200).json({ success: true, user });
        } else {
          res.status(204).json({ success: true });
        }
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      break;
    default:
      break;
  }
}
