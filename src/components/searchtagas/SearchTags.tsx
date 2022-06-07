import {
  Box,
  Button,
  HStack,
  Heading,
  Link,
  List,
  ListItem,
  Spacer,
  Tag,
  TagCloseButton,
  TagLabel,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { AiOutlineTag } from 'react-icons/ai';

import { Container } from '../Container';

const tags = ['TypeScript', 'Next.js', 'Node.js'];

const SearchTags = () => {
  return (
    <Container alignItems={'start'} p={'2'}>
      <List w={'100%'}>
        <ListItem w={'100%'} my={2}>
          <HStack w={'100%'}>
            <NextLink href={`/`} passHref>
              <Button
                as={'a'}
                w={'100%'}
                leftIcon={<>🏠</>}
                bg={''}
                _hover={{
                  bg: 'linkedin.100',
                  color: 'linkedin.600',
                }}
              >
                Home
                <Spacer />
              </Button>
            </NextLink>
          </HStack>
        </ListItem>
        <ListItem w={'100%'} my={2}>
          <HStack w={'100%'}>
            <NextLink href={`/questions`} passHref>
              <Button
                as={'a'}
                w={'100%'}
                leftIcon={<>📝</>}
                bg={'none'}
                _hover={{
                  bg: 'linkedin.100',
                  color: 'linkedin.600',
                }}
              >
                Questions
                <Spacer />
              </Button>
            </NextLink>
          </HStack>
        </ListItem>
      </List>

      <Box w={'100%'} p={'2'} mb={'4'}>
        <Heading mb={'4'} size={'md'}>
          Tags
        </Heading>
        <Heading size={'sm'} mb={'2'}>
          Algorithm
        </Heading>
        <VStack mb={'4'} alignItems={'start'}>
          {tags.map((tag) => (
            <Tag key={tag} w={'auto'} size={'md'} color={'blackAlpha.800'}>
              <NextLink href={`/questions/${tag}`} passHref>
                <Link _hover={{ textDecor: 'none' }}>
                  <TagLabel _hover={{ color: 'blackAlpha.600' }}>
                    {tag}
                  </TagLabel>
                </Link>
              </NextLink>
              <TagCloseButton />
            </Tag>
          ))}
          <Heading size={'sm'} mb={'2'}>
            Language
          </Heading>
          {tags.map((tag) => (
            <Tag key={tag} w={'auto'} size={'md'} color={'blackAlpha.800'}>
              <NextLink href={`/questions/${tag}`} passHref>
                <Link _hover={{ textDecor: 'none' }}>
                  <TagLabel _hover={{ color: 'blackAlpha.600' }}>
                    {tag}
                  </TagLabel>
                </Link>
              </NextLink>
              <TagCloseButton />
            </Tag>
          ))}
        </VStack>
        <Button leftIcon={<AiOutlineTag />} colorScheme={'teal'} size={'sm'}>
          Add Tags
        </Button>
      </Box>
    </Container>
  );
};

export default SearchTags;
