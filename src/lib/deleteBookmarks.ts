import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  console.log('deleteBookmarks', req.query);
  res.status(200).json({});
}
