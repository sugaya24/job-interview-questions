import { useAuthContext } from '@/contexts';
import { useUser } from '@/hooks/useUser';
import { QuestionDocument } from '@/models/Question';
import {
  Avatar,
  Box,
  ButtonGroup,
  HStack,
  Heading,
  IconButton,
  Link,
  Spacer,
  Stack,
  StyleProps,
  Tag,
  Text,
  isStyleProp,
} from '@chakra-ui/react';
import { objectFilter } from '@chakra-ui/utils';
import { format } from 'date-fns';
import NextLink from 'next/link';
import React, { useEffect, useState } from 'react';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { BsBookmark, BsFillBookmarkCheckFill } from 'react-icons/bs';

import { EditMenu } from '.';

export type QuestionDoc = QuestionDocument & {
  createdAt: Date;
  updatedAt: Date;
};
interface Props {
  w: string;
  question: QuestionDoc;
}

const QuestionsCard = (props: Props) => {
  const styleProps: StyleProps = objectFilter(props, (_, prop) =>
    isStyleProp(prop),
  );
  const { currentUser } = useAuthContext();
  const { question } = props;
  const { data } = useUser(question.author.uid);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(question.likes);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setIsLiked(false);
      setIsBookmarked(false);
    } else {
      setIsLiked(likes.includes(currentUser?.uid!));
      setIsBookmarked(currentUser.bookmarks.includes(question.questionId));
    }
  }, [currentUser]);

  const handleLike = async () => {
    setIsLiked(!isLiked);
    if (likes.includes(currentUser?.uid!)) {
      setLikes(likes.filter((uid) => uid !== currentUser?.uid));
      await fetch(`/api/questions/${question.questionId}/unlike`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: currentUser?.uid,
        }),
      });
    } else {
      setLikes([...likes!, currentUser?.uid!]);
      await fetch(`/api/questions/${question.questionId}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: currentUser?.uid,
        }),
      });
    }
  };

  const handleBookmark = async ({ questionId }: { questionId: string }) => {
    if (!currentUser?.uid) {
      return;
    }
    setIsBookmarked(!isBookmarked);
    // add bookmark
    if (!isBookmarked) {
      await fetch(`/api/users/${currentUser.uid}/bookmarks/${questionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: questionId }),
      });
    } else {
      // delete bookmark
      await fetch(`/api/users/${currentUser.uid}/bookmarks/${questionId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: questionId }),
      });
    }
  };

  return (
    <Stack
      w={`100%`}
      mt={6}
      mb={4}
      direction={'row'}
      spacing={4}
      align={'start'}
      {...styleProps}
    >
      <Avatar src={data?.user?.photoURL || ''} />
      <Stack w={'100%'} direction={'column'} spacing={2} fontSize={'sm'}>
        <HStack className={'top-part'}>
          <NextLink href={`/users/${question.author.uid}`} passHref>
            <Link
              _hover={{
                textDecor: 'none',
                color: 'blackAlpha.600',
              }}
            >
              <Text fontWeight={600}>
                {data?.user?.username || 'user deleted'}
              </Text>
            </Link>
          </NextLink>
          <Spacer />
          <Text color={'gray.500'}>
            {format(new Date(question.createdAt), 'MMM dd, yyyy')}
          </Text>
        </HStack>
        <Box className={'main-text'}>
          <NextLink href={`/questions/${question.questionId}`} passHref>
            <Link _visited={{ color: 'gray.400' }}>
              <Heading as={'h2'} fontSize={'xl'}>
                {question.title}
              </Heading>
            </Link>
          </NextLink>
        </Box>
        <HStack className={'bottom-part'}>
          {question.tags.map((tag, i) => (
            <Tag key={i}>{tag}</Tag>
          ))}
          <Spacer />
          <HStack>
            {currentUser?.uid === question.author.uid && <EditMenu />}
            <ButtonGroup spacing={0}>
              <HStack spacing={0}>
                <IconButton
                  disabled={!currentUser}
                  size={'sm'}
                  variant={'none'}
                  aria-label={isLiked ? 'Fill Like' : 'Outline Like'}
                  icon={isLiked ? <AiFillLike /> : <AiOutlineLike />}
                  onClick={handleLike}
                />
                {likes.length && (
                  <Text color={!currentUser ? 'gray.400' : 'black'}>
                    {likes.length}
                  </Text>
                )}
              </HStack>
            </ButtonGroup>
            <Spacer />
            <IconButton
              disabled={!currentUser}
              size={'sm'}
              variant={'none'}
              aria-label={isBookmarked ? 'Fill Bookmark' : 'Bookmark Outline'}
              icon={isBookmarked ? <BsFillBookmarkCheckFill /> : <BsBookmark />}
              onClick={() =>
                handleBookmark({
                  questionId: question.questionId,
                })
              }
            />
          </HStack>
        </HStack>
      </Stack>
    </Stack>
  );
};

export default QuestionsCard;
