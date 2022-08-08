import User, { IUser } from '@/models/User';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const filterQuery: FilterQuery<IUser> = {
      uid: req.query.uid,
    };
    const updateQuery: UpdateQuery<IUser> = {
      $pull: { bookmarks: req.query.questionId },
    };
    await User.findOneAndUpdate(filterQuery, updateQuery);
    res.status(204).json({});
  } catch {
    res.status(400).json({ message: 'Error has occurred.' });
  }
}
