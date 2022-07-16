import { LIMIT_DISPLAY_CONTENT_PER_PAGE } from '@/constant';
import dbConnect from '@/lib/dbConnect';
import Question, { QuestionDocument } from '@/models/Question';
import type {
  FilterQuery,
  ObjectId,
  PaginateOptions,
  PaginateResult,
} from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const pageIndex = req.query.page;
        if (typeof pageIndex !== 'string' || Array.isArray(pageIndex)) {
          res.status(400).end();
          return;
        }
        const query: FilterQuery<QuestionDocument> = {};
        const options: PaginateOptions = {
          pagination: true,
          limit: LIMIT_DISPLAY_CONTENT_PER_PAGE,
          page: +pageIndex,
          sort: { createdAt: -1 },
        };
        const result: PaginateResult<
          QuestionDocument & {
            _id: ObjectId;
          }
        > = await Question.paginate(query, options);
        const questions = result.docs.map(
          (
            doc: QuestionDocument & {
              _id: ObjectId;
            },
          ) => {
            const question = doc.toObject();
            return JSON.parse(JSON.stringify(question));
          },
        );
        res.status(200).json({
          success: true,
          questions,
          totalPages: result.totalPages,
          hasPrevPage: result.hasPrevPage,
          hasNextPage: result.hasNextPage,
          pagingCounter: result.pagingCounter,
          page: result.page,
        });
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
