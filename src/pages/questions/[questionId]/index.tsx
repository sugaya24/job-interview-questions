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
  IconButton,
  Link,
  Spacer,
  Spinner,
  Tag,
  Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import parse from 'html-react-parser';
import { NextSeo } from 'next-seo';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { BiEditAlt } from 'react-icons/bi';

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
          <Box p={4}>
            {/* <Text>content text</Text> */}
            {parse(data?.question?.content!)}
          </Box>
        </Flex>
      </Container>
    </>
  );
};

export default questionDetail;

questionDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
