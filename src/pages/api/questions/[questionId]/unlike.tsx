import dbConnect from '@/lib/dbConnect';
import Question from '@/models/Question';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    res.json({ message: 'only DELETE method is accepted' });
  }
  await dbConnect();

  try {
    const filter = { questionId: req.query.questionId };
    const question = await Question.findOne(filter);
    const updatedLikes = question?.likes.filter((id) => id !== req.body.uid);
    await Question.findOneAndUpdate(filter, {
      $set: {
        likes: updatedLikes,
      },
    });
    res
      .status(200)
      .json({ success: true, message: 'unliked a post successfully.' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}
