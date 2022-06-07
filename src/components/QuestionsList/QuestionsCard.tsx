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
import React, { useState } from 'react';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { BsBookmark, BsFillBookmarkCheckFill } from 'react-icons/bs';

const tags = ['TypeScript', 'Next.js', 'Firebase'];

interface Props {
  w: string;
  questionId: string;
}

const QuestionsCard = (props: Props) => {
  const styleProps: StyleProps = objectFilter(props, (_, prop) =>
    isStyleProp(prop),
  );
  const { questionId } = props;
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

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
      <Avatar src={'https://avatars0.githubusercontent.com/u/1164541?v=4'} />
      <Stack direction={'column'} spacing={2} fontSize={'sm'}>
        <HStack className={'top-part'}>
          <NextLink href={'/users/--username--'}>
            <Link
              _hover={{
                textDecor: 'none',
                color: 'blackAlpha.600',
              }}
            >
              <Text fontWeight={600}>Achim Rolle</Text>
            </Link>
          </NextLink>
          <Spacer />
          <Text color={'gray.500'}>Feb 08, 2021 · 6min read</Text>
        </HStack>
        <Box className={'main-text'}>
          <NextLink href={`/questions/${questionId}`}>
            <Link>
              <Heading as={'h2'} fontSize={'xl'}>
                Title
              </Heading>
            </Link>
          </NextLink>
          <Text wordBreak={'break-word'}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae
            tenetur optio alias quidem minima tempore eaque ratione, saepe omnis
            distinctio voluptate id eligendi rem delectus unde facere,
            dignissimos at possimus!
          </Text>
        </Box>
        <HStack className={'bottom-part'}>
          {tags.map((tag, index) => (
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
                onClick={() => setIsLiked(!isLiked)}
              />
              <HStack>
                <Text>59</Text>
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
