import { Question } from '@/common';
import mongoose, { Document, Model, Schema, models } from 'mongoose';

export interface IQuestion extends Question, Document {}

const questionSchema: Schema = new mongoose.Schema(
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

export type QuestionModel = Model<IQuestion>;
export default models.Question
  ? (models.Question as QuestionModel)
  : mongoose.model<IQuestion>(`Question`, questionSchema);
