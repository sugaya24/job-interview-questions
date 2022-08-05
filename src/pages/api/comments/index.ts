import createComment from '@/lib/createComment';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      break;
    case 'POST':
      return createComment(req, res);
    default:
      break;
  }
}
