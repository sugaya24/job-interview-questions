import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { NextApiRequest, NextApiResponse } from 'next/types';

export default async function authHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect();
  const { method, query } = req;

  switch (method) {
    case 'GET':
      const result = await User.find({});
      const users = result.map((doc) => {
        const user = doc.toObject();
        return JSON.parse(JSON.stringify(user));
      });
      res.status(200).json({ success: true, data: users });
      break;
    case 'POST':
      break;
    default:
      break;
  }
}
