import { Container } from '@/components/Container';
import Layout from '@/components/Layout';
import {
  Avatar,
  Box,
  Divider,
  Flex,
  HStack,
  Heading,
  Link,
  Spacer,
  Tag,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';

const tags = ['Next.js', 'React.js', 'TypeScript'];

const questionDetail = () => {
  const router = useRouter();
  const { questionId } = router.query;

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
          <NextLink href={'/users/--username--'}>
            <Link
              _hover={{
                textDecor: 'none',
                color: 'blackAlpha.600',
              }}
            >
              <HStack>
                <Box>
                  <Avatar
                    src={'https://avatars0.githubusercontent.com/u/1164541?v=4'}
                  />
                </Box>
                <Text fontWeight={600} fontSize={'xl'}>
                  Achim Rolle
                </Text>
              </HStack>
            </Link>
          </NextLink>
          <Spacer />
          <Text color={'gray.500'}>Feb 08, 2021 · 6min read</Text>
        </HStack>
        <Heading mt={4} size={'2xl'} fontWeight={'extrabold'}>
          Title
        </Heading>
        <HStack mt={4}>
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
        </HStack>
        <Divider mt={4} />
        <Box p={4}>
          <Text>content text</Text>
        </Box>
      </Flex>
    </Container>
  );
};

export default questionDetail;

questionDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
