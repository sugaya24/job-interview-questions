import { Container } from '@/components/Container';
import Layout from '@/components/Layout';
import { QuestionsCard } from '@/components/QuestionsList';
import { QuestionDoc } from '@/components/QuestionsList/QuestionsCard';
import { SearchTags } from '@/components/searchtagas';
import { LIMIT_DISPLAY_CONTENT_PER_PAGE } from '@/constant';
import { useQuestions } from '@/hooks';
import {
  Box,
  Button,
  Center,
  Divider,
  Grid,
  GridItem,
  HStack,
  Heading,
  List,
  ListItem,
  Spacer,
  Spinner,
} from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react';

function NavMenu() {
  return (
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
  );
}

type QuestionListProps = {
  data: any[] | undefined;
  size: number;
  setSize: (
    size: number | ((_size: number) => number),
  ) => Promise<any[] | undefined>;
  error: any;
};
const QuestionList = (props: QuestionListProps) => {
  const { data, size, setSize, error } = props;

  const questions: QuestionDoc[] = data ? [].concat(...data) : [];
  const isLoading =
    !error && size > 0 && data && typeof data[size - 1] === 'undefined';
  const isReachingEnd =
    data && data[data.length - 1]?.length < LIMIT_DISPLAY_CONTENT_PER_PAGE;

  return (
    <>
      {questions.map((question, i) => (
        <Box key={question.id}>
          {!i && <Divider />}
          <QuestionsCard w={'100%'} question={question} />
          <Divider />
        </Box>
      ))}
      <Center my={4}>
        <Button
          isLoading={isLoading}
          isDisabled={isReachingEnd}
          colorScheme={'linkedin'}
          onClick={() => setSize(size + 1)}
        >
          {isReachingEnd ? 'No more content' : 'Load More'}
        </Button>
      </Center>
    </>
  );
};

export default function questionsPage() {
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { data, error, size, setSize } = useQuestions(router.query);

  if (error) return `An error has occurred. => ${error.message}`;

  const isLoading = !data && size > 0 && !error;

  return (
    <>
      <NextSeo title={'Question Box'} titleTemplate={'Questions List | %s'} />
      <Container flexGrow={1}>
        <Grid
          w={{ base: '100%', md: 'container.md', lg: `container.lg` }}
          templateColumns={{ base: 'repeat(12, 1fr)' }}
          gap={4}
        >
          <GridItem
            display={{ base: 'none', md: 'block' }}
            colSpan={{ base: 0, md: 3 }}
          >
            <NavMenu />
            <SearchTags
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          </GridItem>
          <GridItem px={4} colSpan={{ base: 12, md: 9 }}>
            <Heading>Questions</Heading>
            {isLoading ? (
              <Center my={4}>
                <Spinner />
              </Center>
            ) : (
              <QuestionList
                data={data}
                error={error}
                size={size}
                setSize={setSize}
              />
            )}
          </GridItem>
        </Grid>
      </Container>
    </>
  );
}

questionsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
