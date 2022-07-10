import { Question } from '@/common/Question';
import { useAuthContext } from '@/contexts';
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
import NextLink from 'next/link';
import React, { useEffect, useState } from 'react';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { BsBookmark, BsFillBookmarkCheckFill } from 'react-icons/bs';

interface Props {
  w: string;
  question: Question;
}

const QuestionsCard = (props: Props) => {
  const styleProps: StyleProps = objectFilter(props, (_, prop) =>
    isStyleProp(prop),
  );
  const { currentUser } = useAuthContext();
  const { question } = props;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(question.likes);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    setIsLiked(likes.includes(currentUser.uid));
  }, [currentUser]);

  const handleLike = () => {
    if (likes.includes(currentUser.uid)) {
      setLikes(likes.filter((uid) => uid !== currentUser.uid));
    } else {
      setLikes([...likes, currentUser.uid]);
    }
    setIsLiked(!isLiked);
  };

  return (
    <Stack
      w={`100%`}
      mt={6}
      mb={2}
      direction={'row'}
      spacing={4}
      align={'start'}
      {...styleProps}
    >
      <Avatar src={question.author.avatar} />
      <Stack w={'100%'} direction={'column'} spacing={2} fontSize={'sm'}>
        <HStack className={'top-part'}>
          <NextLink href={'/users/--username--'}>
            <Link
              _hover={{
                textDecor: 'none',
                color: 'blackAlpha.600',
              }}
            >
              <Text fontWeight={600}>{question.author.name}</Text>
            </Link>
          </NextLink>
          <Spacer />
          <Text color={'gray.500'}>Feb 08, 2021 · 6min read</Text>
        </HStack>
        <Box className={'main-text'}>
          <NextLink href={`/questions/${question.questionId}`}>
            <Link>
              <Heading as={'h2'} fontSize={'xl'}>
                {question.title}
              </Heading>
            </Link>
          </NextLink>
        </Box>
        <HStack className={'bottom-part'}>
          {question.tags.map((tag, index) => (
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
          <Spacer />
          <HStack>
            <ButtonGroup spacing={0}>
              <IconButton
                size={'sm'}
                variant={'none'}
                aria-label={isLiked ? 'Fill Like' : 'Outline Like'}
                icon={isLiked ? <AiFillLike /> : <AiOutlineLike />}
                onClick={handleLike}
              />
              <HStack>
                <Text>{likes.length}</Text>
              </HStack>
            </ButtonGroup>
            <Spacer />
            <IconButton
              size={'sm'}
              variant={'none'}
              aria-label={isBookmarked ? 'Fill Bookmark' : 'Bookmark Outline'}
              icon={isBookmarked ? <BsFillBookmarkCheckFill /> : <BsBookmark />}
              onClick={() => setIsBookmarked(!isBookmarked)}
            />
          </HStack>
        </HStack>
      </Stack>
    </Stack>
  );
};

export default QuestionsCard;
