import Question from '@/models/Question';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function getUsersQuestions(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const questions = await Question.find({ 'author.uid': req.query.uid }).sort(
      {
        updatedAt: -1,
      },
    );
    res.status(200).json(questions);
  } catch {
    res.status(400).json({ message: 'Error has occurred.' });
  }
}
