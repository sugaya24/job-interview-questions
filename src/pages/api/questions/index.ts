import dbConnect from '@/lib/dbConnect';
import Question from '@/models/Question';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const result = await Question.find({});
        const questions = result.map((doc) => {
          const question = doc.toObject();
          return JSON.parse(JSON.stringify(question));
        });
        res.status(200).json({ success: true, questions });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case 'POST':
      try {
        await Question.create(req.body);
        res.status(201).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      break;
  }
}
