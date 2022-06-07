import {
  Avatar,
  Box,
  Center,
  Heading,
  Link,
  Stack,
  Tag,
  Text,
  Wrap,
  WrapItem,
  useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

const QuestionsCard = () => {
  return (
    <Center py={6} fontSize={'sm'}>
      <Box
        maxW={'445px'}
        w={'full'}
        px={4}
        bg={useColorModeValue('white', 'gray.900')}
        rounded={'md'}
        overflow={'hidden'}
      >
        <Stack>
          <Heading
            color={useColorModeValue('gray.700', 'white')}
            fontSize={'lg'}
            fontFamily={'body'}
          >
            Boost your conversion rate. Boost your.
          </Heading>
        </Stack>
        <Wrap mt={2}>
          <WrapItem>
            <Tag>Next.js</Tag>
          </WrapItem>
          <WrapItem>
            <Tag>Next.js</Tag>
          </WrapItem>
          <WrapItem>
            <Tag>JavaScript</Tag>
          </WrapItem>
        </Wrap>
        <Stack mt={2} direction={'row'} spacing={4} align={'center'}>
          <Avatar
            size={'sm'}
            src={'https://avatars0.githubusercontent.com/u/1164541?v=4'}
          />
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
        </Stack>
      </Box>
    </Center>
  );
};

export default QuestionsCard;
