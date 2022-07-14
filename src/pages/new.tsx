import { Question } from '@/common';
import { ChakraTagInput } from '@/components/ChakraTagInput';
import { Container } from '@/components/Container';
import Layout from '@/components/Layout';
import { Editor } from '@/components/createnewpost';
import { useAuthContext } from '@/contexts';
import { useQuestions } from '@/hooks';
import { Box, Button, HStack, Input } from '@chakra-ui/react';
import { $generateHtmlFromNodes } from '@lexical/html';
// import parse from 'html-react-parser';
import type { EditorState, LexicalEditor } from 'lexical';
import { nanoid } from 'nanoid';
import router from 'next/router';
import React, { ReactElement, useState } from 'react';

const createNewPost = () => {
  const { currentUser } = useAuthContext();
  const { mutate } = useQuestions();
  const [htmlString, setHtmlString] = useState<string>('');
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

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
      title: title,
      tags: tags,
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
    router.push('/questions');
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
        <Input
          w={'100%'}
          mb={4}
          value={title}
          outline={'none'}
          size={'lg'}
          fontSize={'lg'}
          focusBorderColor={'none'}
          bgColor={'white'}
          placeholder={'Title'}
          onChange={(e) => setTitle(e.target.value)}
        />
        <ChakraTagInput tags={tags} setTags={setTags} />
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
