import Question from '@/models/Question';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { currentUser, editorState, questionId } = req.body;
  if (!currentUser || !editorState || !questionId) {
    res.status(400).json({ message: 'Missing parameter.' });
  }

  try {
    const filter = { questionId: questionId };
    await Question.findOneAndUpdate(filter, {
      $push: {
        comments: { userId: currentUser.uid, editorState: editorState },
      },
    });
    res.status(200).json({});
  } catch {
    res.status(400).json({ message: 'Unexpected error occurred.' });
  }
}
