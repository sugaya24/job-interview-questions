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
          res.status(404).json({ success: true, message: 'user not found' });
        }
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case 'PUT':
      const filter = { uid: query.uid };
      try {
        const updatedUser = await User.findOneAndUpdate(filter, {
          $set: {
            username: req.body.username,
            photoURL: req.body.photoURL,
            github: req.body.github,
            twitter: req.body.twitter,
          },
        });
        res.status(200).json({ success: true, user: updatedUser });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      break;
  }
}
