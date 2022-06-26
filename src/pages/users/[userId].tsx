import { Container } from '@/components/Container';
import Layout from '@/components/Layout';
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { BiEdit } from 'react-icons/bi';

const userProfile = ({ user }) => {
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
        <HStack>
          <Box>
            <Avatar
              size={'xl'}
              src={'https://avatars0.githubusercontent.com/u/1164541?v=4'}
            />
          </Box>
          <Heading>{user.username}</Heading>
          <Spacer />
          <Flex h={'100%'} flexDir={'column'} justifyContent={'flex-start'}>
            <Button
              m={2}
              rightIcon={<BiEdit />}
              variant={'outline'}
              boxShadow={'md'}
            >
              Edit
            </Button>
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
  );
};

export async function getServerSideProps(ctx) {
  const userId = ctx.query.userId;
  const res = await fetch(`http://localhost:3000/api/users/${userId}`);
  const data = await res.json();
  const { user } = data;

  return { props: { user: user } };
}

export default userProfile;

userProfile.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
