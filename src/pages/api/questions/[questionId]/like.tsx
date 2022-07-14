import dbConnect from '@/lib/dbConnect';
import Question from '@/models/Question';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    res.json({ message: 'only PUT method is accepted' });
  }
  await dbConnect();

  try {
    const filter = { questionId: req.query.questionId };
    const question = await Question.findOne(filter);
    const updatedLikes = [...question.likes, req.body.uid];
    await Question.findOneAndUpdate(filter, {
      $set: {
        likes: updatedLikes,
      },
    });
    res.status(200).json({
      success: true,
      message: 'liked a post successfully.',
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
