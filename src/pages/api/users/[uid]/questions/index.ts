import getUsersQuestions from '@/lib/getUsersQuestions';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getUsersQuestions(req, res);
    default:
      break;
  }
}
