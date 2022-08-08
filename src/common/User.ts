import { Question } from './Question';

export type User = {
  uid: string | null | undefined;
  username: string | null | undefined;
  email: string | null | undefined;
  photoURL: string | null | undefined;
  github?: string | null | undefined;
  twitter?: string | null | undefined;
  website?: string | null | undefined;
  bookmarks: Question[];
};
