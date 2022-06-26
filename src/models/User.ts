import mongoose, { Document, Model, Schema, models } from 'mongoose';

export interface IUser extends Document {
  username: string;
  uid: string;
  email: string;
}

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
  },
  { timestamps: true },
);

export type UserModel = Model<IUser>;
export default models.User
  ? (models.User as UserModel)
  : mongoose.model<IUser>(`User`, userSchema);
