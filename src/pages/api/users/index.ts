import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { NextApiRequest, NextApiResponse } from 'next/types';

export default async function authHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect();
  const { method } = req;

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
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      break;
  }
}
