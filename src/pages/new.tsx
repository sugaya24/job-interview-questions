import { Question } from '@/common';
import { Container } from '@/components/Container';
import Layout from '@/components/Layout';
import { Editor } from '@/components/createnewpost';
import { useAuthContext } from '@/contexts';
import { useQuestions } from '@/hooks';
import { Box, Button, HStack } from '@chakra-ui/react';
import { $generateHtmlFromNodes } from '@lexical/html';
// import parse from 'html-react-parser';
import type { EditorState, LexicalEditor } from 'lexical';
import { nanoid } from 'nanoid';
import React, { ReactElement, useState } from 'react';

const createNewPost = () => {
  const [htmlString, setHtmlString] = useState<string>('');
  const [isPosting, setIsPosting] = useState(false);
  const { currentUser } = useAuthContext();
  const { mutate } = useQuestions();

  function onChange(_editorState: EditorState, editor: LexicalEditor) {
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
      title: `title posted by ${currentUser?.username}`,
      tags: ['tag1', 'tag2'],
      likes: [],
      author: {
        uid: currentUser.uid,
        name: currentUser.username,
        avatar: currentUser.photoURL,
      },
    };
    await fetch(`/api/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    });
    mutate();
    setIsPosting(false);
  }

  return (
    <Container py={4} flexGrow={1}>
      <Box
        w={'container.lg'}
        h={'100%'}
        flexGrow={1}
        display={'flex'}
        flexDir={'column'}
      >
        <Editor onChange={onChange} />
        <HStack mt={4}>
          <Button
            isDisabled={!currentUser || isPosting}
            isLoading={isPosting}
            colorScheme={'blue'}
            onClick={postContent}
          >
            Post
          </Button>
          {/* <Button variant={'outline'} colorScheme={'yellow'}>
            Save Draft
          </Button> */}
        </HStack>
      </Box>
    </Container>
  );
};

export default createNewPost;
createNewPost.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
