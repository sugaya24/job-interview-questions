import Tag from '@/models/Tag';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case 'GET':
      try {
        const tagsList = await Tag.find();
        res.status(200).json(tagsList);
      } catch {
        res.status(400);
      }
      break;
    case 'POST':
      try {
        (async function () {
          for (const tag of req.body.tags) {
            if ((await Tag.findOne({ tagId: tag })) === null) {
              await Tag.create({ tagId: tag, name: tag });
            }
          }
        })();
        res.status(201).json({});
      } catch {
        res.status(400);
      }
      break;
    default:
      break;
  }
}
