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
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      const { username, uid, photoURL, email } = req.body;
      try {
        const user = await User.create({
          uid: uid,
          username: username,
          email: email,
          photoURL: photoURL,
          github: '',
          twitter: '',
        });
        res.status(201).json({ success: true, user });
      } catch {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const updatedUser = await User.findOneAndUpdate({
          $set: {
            username: req.body.username,
            github: req.body.github,
            twitter: req.body.twitter,
          },
        });
        res.status(200).json({ success: true, user: updatedUser });
      } catch {
        res.status(400).json({ success: false });
      }
      break;
    default:
      break;
  }
}
