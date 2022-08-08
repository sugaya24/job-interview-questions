import User, { IUser } from '@/models/User';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function addBookmarks(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const filterQuery: FilterQuery<IUser> = { uid: req.query.uid };
  const updateQuery: UpdateQuery<IUser> = {
    $addToSet: { bookmarks: req.query.questionId },
  };
  const updatedUser = await User.findOneAndUpdate(filterQuery, updateQuery);
  res.status(200).json(updatedUser);
}
