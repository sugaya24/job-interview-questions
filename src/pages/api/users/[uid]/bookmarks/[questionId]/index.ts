import addBookmarks from '@/lib/addBookmark';
import deleteBookmarks from '@/lib/deleteBookmarks';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT':
      return addBookmarks(req, res);
    case 'DELETE':
      return deleteBookmarks(req, res);
    default:
      break;
  }
}
