import { TTag } from '@/common/Tag';
import mongoose, { Document, Model, Schema, models } from 'mongoose';

export interface ITag extends TTag, Document {}

const tagSchema: Schema = new mongoose.Schema(
  {
    tagId: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true },
);

export type TagModel = Model<ITag>;
export default models.Tag
  ? (models.Tag as TagModel)
  : mongoose.model<ITag>('Tag', tagSchema);
