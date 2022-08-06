import Question from '@/models/Question';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { currentUser, editorState, questionId, htmlString } = req.body;
  if (!currentUser || !editorState || !questionId || !htmlString) {
    res.status(400).json({ message: 'Missing parameter.' });
  }

  try {
    const filter = { questionId: questionId };
    await Question.findOneAndUpdate(filter, {
      $push: {
        comments: {
          userId: currentUser.uid,
          editorState: editorState,
          htmlString: htmlString,
        },
      },
    });
    res.status(200).json({});
  } catch {
    res.status(400).json({ message: 'Unexpected error occurred.' });
  }
}
