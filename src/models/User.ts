import { User } from '@/common';
import mongoose, { Document, Model, Schema, models } from 'mongoose';

export interface IUser extends User, Document {}

const userSchema: Schema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: [true, `Please add uid`],
    },
    username: {
      type: String,
      required: [true, `Please add an username`],
    },
    email: {
      type: String,
    },
    photoURL: {
      type: String,
    },
    github: {
      type: String,
    },
    twitter: {
      type: String,
    },
    bookmarks: {
      type: Array,
    },
  },
  { timestamps: true },
);

export type UserModel = Model<IUser>;
export default models.User
  ? (models.User as UserModel)
  : mongoose.model<IUser>(`User`, userSchema);
