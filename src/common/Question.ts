export type Question = {
  questionId: string;
  title: string;
  content: string;
  tags: string[];
  likes: string[];
  author: {
    name: string;
    avatar: string;
    uid: string;
  };
};
