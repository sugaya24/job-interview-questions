export type Question = {
  questionId: string;
  title: string;
  content: string;
  editorState: string;
  tags: string[];
  likes: string[];
  comments: {
    userId: string;
    editorState: string;
    htmlString: string;
  }[];
  author: {
    name: string;
    avatar: string;
    uid: string;
  };
};
