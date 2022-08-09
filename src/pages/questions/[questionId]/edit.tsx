import { Question } from '@/common';
import { Container } from '@/components/Container';
import EditorBlock from '@/components/EditorBlock';
import Navbar from '@/components/Navbar';
import { useAuthContext } from '@/contexts';
import { useQuestions } from '@/hooks';
import { QuestionDocument } from '@/models/Question';
import { Box, Center, Spinner } from '@chakra-ui/react';
import { $generateHtmlFromNodes } from '@lexical/html';
import { EditorState, LexicalEditor, createEditor } from 'lexical';
import { NextSeo } from 'next-seo';
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
  const [hasContent, setHasContent] = useState<boolean>(false);
  const editor = createEditor();

  const protectPage = async (
    currentUserUid: string,
    authorUid: string,
  ): Promise<boolean> => {
    if (currentUserUid !== authorUid) {
      router.replace('/questions');
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (currentUser === null) {
      router.replace('/questions');
    }
    if (!router.isReady || !currentUser) {
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
        const resProtectPage = await protectPage(
          currentUser?.uid!,
          question.author.uid,
        );
        if (resProtectPage) {
          setQuestion(question);
          setTitle(question.title);
          setTags(question.tags);
          setEditorState(editor.parseEditorState(question.editorState!));
          setIsLoading(false);
        }
      } catch {
        console.log('fetch error');
      }
    };
    fetchQuestion();

    return () => {
      fetchQuestion();
    };
  }, [router, currentUser]);

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
      setHasContent(!(editorState?._nodeMap.size === 2) && !undefined);
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
    await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tags: tags }),
    });
    setIsPosting(false);
    mutate();
    router.push('/questions');
  }

  return (
    <>
      <NextSeo title={'Question Box'} titleTemplate={'Edit | %s'} />
      <Box h={'100vh'} display={'flex'} flexDir={'column'}>
        <Navbar />
        <Container py={4} flex={'1 0 auto'}>
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

export default editPage;
