import { Container } from '@/components/Container';
import Layout from '@/components/Layout';
import { useAuthContext } from '@/contexts';
import { useUser } from '@/hooks/useUser';
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Heading,
  Spacer,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { BiEdit } from 'react-icons/bi';

const userProfile = () => {
  const { currentUser } = useAuthContext();
  const router = useRouter();
  const { userId } = router.query;
  const { data, error } = useUser(Array.isArray(userId) ? userId[0] : userId);

  if (!data)
    return (
      <Container flexGrow={1}>
        <Flex
          w={'container.lg'}
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
      <NextSeo title={user.username} titleTemplate={'%s | Question Box'} />
      <Container flexGrow={1}>
        <Flex
          w={'container.lg'}
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
              <Avatar size={'xl'} src={user.photoURL} />
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
                <Heading fontSize={'lg'}>No questions yet</Heading>
              </TabPanel>
              <TabPanel>
                <Heading fontSize={'lg'}>No saved questions yet</Heading>
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
