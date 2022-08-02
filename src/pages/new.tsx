import { Question } from '@/common';
import { Container } from '@/components/Container';
import EditorBlock from '@/components/EditorBlock';
import Navbar from '@/components/Navbar';
import { useAuthContext } from '@/contexts';
import { useQuestions } from '@/hooks';
import { Box } from '@chakra-ui/react';
import { $generateHtmlFromNodes } from '@lexical/html';
import { EditorState, LexicalEditor } from 'lexical';
import { nanoid } from 'nanoid';
import { NextSeo } from 'next-seo';
import router from 'next/router';
import React, { ReactElement, useState } from 'react';

const createNewPost = () => {
  const { currentUser } = useAuthContext();
  const { mutate } = useQuestions();
  const [htmlString, setHtmlString] = useState<string>('');
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [editorState, setEditorState] = useState<EditorState | undefined>(
    undefined,
  );
  const [hasContent, setHasContent] = useState<boolean>(false);

  function onChange(editorState: EditorState, editor: LexicalEditor) {
    editorState.read(() => {
      setEditorState(editorState);
      setHasContent(!(editorState?._nodeMap.size === 2) && !undefined);
    });
    editor.update(() => {
      const htmlFromNodes = $generateHtmlFromNodes(editor);
      setHtmlString(htmlFromNodes);
    });
  }

  async function postContent() {
    setIsPosting(true);
    const newPost: Question = {
      questionId: nanoid(10),
      content: htmlString,
      editorState: JSON.stringify(editorState!),
      title: title,
      tags: tags,
      likes: [],
      author: {
        uid: currentUser?.uid!,
        name: currentUser?.username!,
        avatar: currentUser?.photoURL!,
      },
    };
    await fetch(`/api/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    });
    setIsPosting(false);
    mutate();
    router.push('/questions');
  }

  return (
    <>
      <NextSeo title={'Question Box'} titleTemplate={'Create New Post | %s'} />
      <Box h={'100vh'} display={'flex'} flexDir={'column'}>
        <Navbar />
        <Container py={4} flexGrow={1}>
          <EditorBlock
            title={title}
            setTitle={setTitle}
            tags={tags}
            setTags={setTags}
            onChange={onChange}
            editorState={editorState}
            currentUser={currentUser}
            isPosting={isPosting}
            hasContent={hasContent}
            postContent={postContent}
          />
        </Container>
      </Box>
    </>
  );
};

export default createNewPost;
