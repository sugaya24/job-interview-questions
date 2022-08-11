import { Question } from '@/common';
import { Container } from '@/components/Container';
import Layout from '@/components/Layout';
import { useAuthContext } from '@/contexts';
import { useQuestion } from '@/hooks';
import { useUser } from '@/hooks/useUser';
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Heading,
  List,
  ListItem,
  SkeletonCircle,
  SkeletonText,
  Spacer,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { NextSeo } from 'next-seo';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react';
import { BiEdit, BiLike } from 'react-icons/bi';

const BookmarkList = ({ bookmarks }: { bookmarks: string[] }) => {
  return (
    <>
      <List>
        {bookmarks.map((questionId, i) => (
          <>
            <BookmarkListItem key={i} questionId={questionId} />
            <Divider />
          </>
        ))}
      </List>
    </>
  );
};

const UsersQuestionsList = ({
  usersQuestions,
}: {
  usersQuestions: (Question & {
    createdAt: Date;
    updatedAt: Date;
  })[];
}) => {
  return (
    <List>
      {usersQuestions.map((question) => (
        <Box key={question.questionId}>
          <Box p={6}>
            <HStack>
              <Avatar size={'sm'} src={question.author.avatar} />
              <Heading size={'sm'}>{question.author.name}</Heading>
            </HStack>
            <Heading>{question.title}</Heading>
            <HStack gap={4} color={'GrayText'}>
              <Text size={'sm'}>
                posted at:{' '}
                {question.createdAt &&
                  format(new Date(question.createdAt), 'MMM dd, yyyy')}
              </Text>
              <HStack>
                <BiLike />
                <Text>{question.likes.length}</Text>
              </HStack>
            </HStack>
          </Box>
          <Divider />
        </Box>
      ))}
    </List>
  );
};

const BookmarkListItem = ({ questionId }: { questionId: string }) => {
  const { data, error } = useQuestion(questionId);
  const isLoading = !data && !error;

  const Item = () => {
    if (isLoading) {
      return (
        <Box padding="6">
          <SkeletonCircle size="10" />
          <SkeletonText mt="4" noOfLines={2} spacing="4" />
        </Box>
      );
    } else {
      return (
        <Box p={6} key={questionId}>
          <HStack>
            <Avatar size={'sm'} src={data?.question.author.avatar} />
            <Heading size={'sm'}>{data?.question.author.name}</Heading>
          </HStack>
          <Heading>{data?.question.title}</Heading>
          <HStack gap={4} color={'GrayText'}>
            <Text size={'sm'}>
              posted at:{' '}
              {data?.question.createdAt &&
                format(new Date(data?.question.createdAt), 'MMM dd, yyyy')}
            </Text>
            <HStack>
              <BiLike />
              <Text>{data?.question.likes.length}</Text>
            </HStack>
          </HStack>
        </Box>
      );
    }
  };

  return <ListItem>{Item()}</ListItem>;
};

const userProfile = () => {
  const { currentUser } = useAuthContext();
  const router = useRouter();
  const { userId } = router.query;
  const { data, error } = useUser(
    Array.isArray(userId) ? userId[0] : userId || '',
  );
  const [usersQuestions, setUsersQuestions] = useState<
    (Question & {
      createdAt: Date;
      updatedAt: Date;
    })[]
  >([]);

  useEffect(() => {
    if (!data) {
      return;
    }
    const fetchUsersQuestions = async () => {
      const res = await fetch(`/api/users/${user.uid}/questions`);
      const data = await res.json();
      setUsersQuestions(data);
    };
    fetchUsersQuestions();
    return () => {
      fetchUsersQuestions();
    };
  }, [data]);

  if (!data)
    return (
      <Container flexGrow={1}>
        <Flex
          w={{ base: '100%', md: 'container.md', lg: 'container.lg' }}
          my={8}
          py={4}
          px={8}
          flexGrow={1}
          flexDir={'column'}
          bgColor={'white'}
          border={'1px'}
          borderColor={'blackAlpha.400'}
          borderRadius={'2xl'}
        >
          <Center h={'100%'}>
            <Spinner />
          </Center>
        </Flex>
      </Container>
    );
  if (error) return 'An error has occurred';
  const { user } = data;

  return (
    <>
      <NextSeo
        title={user.username || ''}
        titleTemplate={'%s | Question Box'}
      />
      <Container mx={4} flexGrow={1}>
        <Flex
          w={{ base: '100%', md: 'container.md', lg: 'container.lg' }}
          my={8}
          py={4}
          px={8}
          flexGrow={1}
          flexDir={'column'}
          bgColor={'white'}
          border={'1px'}
          borderColor={'blackAlpha.400'}
          borderRadius={'2xl'}
        >
          <HStack>
            <Box>
              <Avatar size={'xl'} src={user.photoURL || ''} />
            </Box>
            <Heading>{user.username}</Heading>
            <Spacer />
            <Flex h={'100%'} flexDir={'column'} justifyContent={'flex-start'}>
              {currentUser?.uid === userId && (
                <NextLink href={`/settings/profile`}>
                  <Button
                    m={2}
                    rightIcon={<BiEdit />}
                    variant={'outline'}
                    boxShadow={'md'}
                  >
                    Edit
                  </Button>
                </NextLink>
              )}
            </Flex>
          </HStack>
          <Tabs my={8}>
            <TabList>
              <Tab>Questions</Tab>
              <Tab>Saved</Tab>
              <Tab>Following</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                {usersQuestions.length ? (
                  <UsersQuestionsList usersQuestions={usersQuestions} />
                ) : (
                  <Heading fontSize={'lg'}>No questions yet</Heading>
                )}
              </TabPanel>
              <TabPanel>
                {data.user.bookmarks.length ? (
                  <BookmarkList bookmarks={data.user.bookmarks} />
                ) : (
                  <Heading fontSize={'lg'}>No saved questions yet</Heading>
                )}
              </TabPanel>
              <TabPanel>
                <Heading fontSize={'lg'}>No Follows yet</Heading>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Container>
    </>
  );
};

export default userProfile;

userProfile.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
