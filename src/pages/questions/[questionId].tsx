import { Container } from '@/components/Container';
import Layout from '@/components/Layout';
import { useQuestion } from '@/hooks';
import {
  Avatar,
  Box,
  Center,
  Divider,
  Flex,
  HStack,
  Heading,
  Link,
  Spacer,
  Spinner,
  Tag,
  Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import parse from 'html-react-parser';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';

const questionDetail = () => {
  const router = useRouter();
  const { questionId } = router.query;
  const { data, error, isLoading } = useQuestion(
    Array.isArray(questionId) ? questionId[0] : questionId,
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
    <Container flex={'1 0 auto'}>
      <Flex
        w={'container.lg'}
        my={8}
        py={8}
        px={12}
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
          <Text color={'gray.500'}>
            posted at{' '}
            {format(new Date(data?.question?.createdAt), 'MMM dd, yyyy')}
          </Text>
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
        <Box p={4}>
          {/* <Text>content text</Text> */}
          {parse(data?.question?.content)}
        </Box>
      </Flex>
    </Container>
  );
};

export default questionDetail;

questionDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
