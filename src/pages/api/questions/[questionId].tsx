import dbConnect from '@/lib/dbConnect';
import Question from '@/models/Question';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { method, query } = req;

  switch (method) {
    case 'GET':
      try {
        const question = await Question.findOne({
          questionId: query.questionId,
        });
        if (question) {
          res.status(200).json({ success: true, question });
        } else {
          res
            .status(404)
            .json({ success: true, message: 'question not found' });
        }
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      break;
  }
}
