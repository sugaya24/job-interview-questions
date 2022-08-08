import User from '@/models/User';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(400).json({ message: 'Invalid request method.' });
  }
  try {
    const user = await User.findOne({ uid: req.query.uid });
    const bookmarks = user?.bookmarks;
    res.status(200).json(bookmarks);
  } catch {
    res.status(400).json({ message: 'Error has occurred.' });
  }
}
