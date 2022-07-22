import { Question } from '@/common';
import { ChakraTagInput } from '@/components/ChakraTagInput';
import { Container } from '@/components/Container';
import Navbar from '@/components/Navbar';
import { Editor } from '@/components/createnewpost';
import { useAuthContext } from '@/contexts';
import { useQuestions } from '@/hooks';
import { QuestionDocument } from '@/models/Question';
import { Box, Button, Center, HStack, Input, Spinner } from '@chakra-ui/react';
import { $generateHtmlFromNodes } from '@lexical/html';
import { EditorState, LexicalEditor, createEditor } from 'lexical';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useEffect } from 'react';

const editPage = () => {
  const { currentUser } = useAuthContext();
  const { mutate } = useQuestions();
  const router = useRouter();
  const { query } = router;
  const [question, setQuestion] = useState<Question>();
  const [htmlString, setHtmlString] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [editorState, setEditorState] = useState<EditorState | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const editor = createEditor();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const reqController = new AbortController();
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`/api/questions/${query.questionId}`, {
          signal: reqController.signal,
        });
        const data: { success: boolean; question: QuestionDocument } =
          await res.json();
        const { question } = data;
        setQuestion(question);
        setTitle(question.title);
        setTags(question.tags);
        setEditorState(editor.parseEditorState(question.editorState!));
        setIsLoading(false);
      } catch {
        console.log('fetch error');
      }
    };
    fetchQuestion();

    return () => {
      fetchQuestion();
    };
  }, [router]);

  if (isLoading) {
    return (
      <Center h={'100vh'}>
        <Spinner />
      </Center>
    );
  }

  const onChange = (editorState: EditorState, editor: LexicalEditor) => {
    editorState.read(() => {
      setEditorState(editorState);
    });
    editor.update(() => {
      const htmlFromNodes = $generateHtmlFromNodes(editor);
      setHtmlString(htmlFromNodes);
    });
  };

  async function postContent() {
    setIsPosting(true);
    const updatePost = {
      ...question,
      title,
      tags,
      content: htmlString,
      editorState: JSON.stringify(editorState),
    };
    await fetch(`/api/questions/${question?.questionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePost),
    });
    setIsPosting(false);
    mutate();
    router.push('/questions');
  }

  return (
    <>
      <Box h={'100vh'} display={'flex'} flexDir={'column'}>
        <Navbar />
        <Container py={4} flex={'1 0 auto'}>
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
            <Editor onChange={onChange} initialEditorState={editorState} />
            <HStack mt={4}>
              <Button
                isDisabled={!currentUser || isPosting}
                isLoading={isPosting}
                colorScheme={'blue'}
                onClick={postContent}
              >
                Post
              </Button>
            </HStack>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default editPage;
