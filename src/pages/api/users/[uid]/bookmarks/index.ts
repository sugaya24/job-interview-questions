import getBookmarks from '@/lib/getBookmarks';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getBookmarks(req, res);
    default:
      break;
  }
}
