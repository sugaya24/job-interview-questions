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
      } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case 'PUT':
      const filter = { questionId: query.questionId };
      const { title, content, tags, likes, editorState } = req.body;
      try {
        await Question.findOneAndUpdate(filter, {
          $set: {
            title: title,
            content: content,
            editorState: editorState,
            tags: tags,
            likes: likes,
          },
        });
        res.status(200).json({});
      } catch {
        res.status(400).json('error');
      }
      break;
    default:
      break;
  }
}
