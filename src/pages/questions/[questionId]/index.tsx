import { User } from '@/common';
import { Container } from '@/components/Container';
import Layout from '@/components/Layout';
import { Editor } from '@/components/createnewpost';
import { useAuthContext } from '@/contexts';
import { useQuestion } from '@/hooks';
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Heading,
  IconButton,
  Link,
  List,
  ListItem,
  Spacer,
  Spinner,
  Tag,
  Text,
} from '@chakra-ui/react';
import { $generateHtmlFromNodes } from '@lexical/html';
import { format } from 'date-fns';
import parse from 'html-react-parser';
import { EditorState, LexicalEditor } from 'lexical';
import { NextSeo } from 'next-seo';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react';
import { BiEditAlt } from 'react-icons/bi';

const CommentList = ({
  comments,
}: {
  comments: { userId: string; editorState: string; htmlString: string }[];
}) => {
  return (
    <Box w={{ base: '100%', md: 'container.md', lg: 'container.lg' }} mb={8}>
      <Heading ml={4} py={2}>
        Comment ({comments.length})
      </Heading>
      <Divider />
      <Box>
        <List>
          {comments.map((comment, i) => (
            <ListItem key={i}>{parse(comment.htmlString)}</ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

const CommentEditor = ({ questionId }: { questionId: string }) => {
  const { currentUser } = useAuthContext();
  const { mutate } = useQuestion(questionId);
  const [editorState, setEditorState] = useState<EditorState>();
  const [htmlString, setHtmlString] = useState('');
  const [hasContent, setHasContent] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const postComment = async () => {
    setIsPosting(true);
    if (!currentUser) {
      return;
    }
    const comment: {
      currentUser: User;
      editorState: string;
      questionId: string;
      htmlString: string;
    } = {
      currentUser: currentUser,
      editorState: JSON.stringify(editorState),
      questionId: questionId,
      htmlString: htmlString,
    };
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(comment),
    });
    sleep(3000).then(() => {
      setIsPosting(false);
      mutate();
    });
  };

  return (
    <Box w={{ base: '100%', md: 'container.md', lg: 'container.lg' }} mb={8}>
      <Box h={'300px'} mb={4}>
        <Editor
          onChange={(editorState: EditorState, editor: LexicalEditor): void => {
            editorState.read(() => {
              setEditorState(editorState);
              setHasContent(!(editorState?._nodeMap.size === 2) && !undefined);
            });
            editor.update(() => {
              setHtmlString($generateHtmlFromNodes(editor));
            });
          }}
          initialEditorState={undefined}
        />
      </Box>
      <Button
        colorScheme={'blue'}
        isDisabled={!currentUser || isPosting || !hasContent}
        isLoading={isPosting}
        onClick={postComment}
      >
        Post
      </Button>
    </Box>
  );
};

const questionDetail = () => {
  const router = useRouter();
  const { questionId } = router.query;
  const { data, error, isLoading } = useQuestion(
    typeof questionId === 'string' ? questionId : '',
  );

  if (error) return 'error has occurred';
  if (isLoading)
    return (
      <Container flex={'1 0 auto'}>
        <Center h={'100%'}>
          <Spinner />
        </Center>
      </Container>
    );

  return (
    <>
      <NextSeo
        title={data?.question.title}
        titleTemplate={'%s | Question Box'}
      />
      <Container flex={'1 0 auto'} px={4}>
        <Flex
          w={{ base: '100%', md: 'container.md', lg: 'container.lg' }}
          my={8}
          py={8}
          px={{ base: 8, md: 12 }}
          flexDir={'column'}
          rounded={'2xl'}
          bgColor={'white'}
          border={'1px'}
          borderColor={'blackAlpha.400'}
        >
          <HStack>
            <NextLink href={`/users/${data?.question?.author.uid}`}>
              <Link
                _hover={{
                  textDecor: 'none',
                  color: 'blackAlpha.600',
                }}
              >
                <HStack>
                  <Box>
                    <Avatar src={data?.question?.author.avatar} />
                  </Box>
                  <Text fontWeight={600} fontSize={'xl'}>
                    {data?.question?.author.name}
                  </Text>
                </HStack>
              </Link>
            </NextLink>
            <Spacer />
            <HStack>
              <NextLink href={`/questions/${data?.question.questionId}/edit`}>
                <IconButton
                  aria-label={'edit'}
                  variant={'outline'}
                  icon={<BiEditAlt />}
                />
              </NextLink>
              <Text color={'gray.500'}>
                posted at{' '}
                {format(new Date(data?.question?.createdAt!), 'MMM dd, yyyy')}
              </Text>
            </HStack>
          </HStack>
          <Heading mt={4} size={'2xl'} fontWeight={'extrabold'}>
            {data?.question?.title}
          </Heading>
          <HStack mt={4}>
            {data?.question?.tags.map((tag, index) => (
              <NextLink key={index} href={`/tags/${tag}`} passHref>
                <Link
                  _hover={{
                    textDecor: 'none',
                  }}
                >
                  <Tag
                    _hover={{
                      color: 'blackAlpha.600',
                    }}
                  >
                    {tag}
                  </Tag>
                </Link>
              </NextLink>
            ))}
          </HStack>
          <Divider mt={4} />
          <Box p={4}>{parse(data?.question?.content || '')}</Box>
        </Flex>
        <CommentList comments={data?.question.comments || []} />
        <CommentEditor questionId={questionId as string} />
      </Container>
    </>
  );
};

export default questionDetail;

questionDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
