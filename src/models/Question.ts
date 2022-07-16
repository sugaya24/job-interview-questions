import { Question } from '@/common';
import mongoose, { Document, Schema } from 'mongoose';
import type { Model, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface QuestionDocument extends Question, Document {}

const questionSchema: Schema = new mongoose.Schema<QuestionDocument>(
  {
    questionId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: Array,
    likes: Array,
    author: {
      name: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        required: true,
      },
      uid: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true },
);

questionSchema.plugin(mongoosePaginate);

export interface QuestionDocument extends mongoose.Document, Question {}
interface QuestionModel extends Model<QuestionDocument> {}

export default mongoose.models.Question
  ? (mongoose.models.Question as QuestionModel)
  : mongoose.model<QuestionDocument, PaginateModel<QuestionDocument>>(
      `Question`,
      questionSchema,
      `questions`,
    );
