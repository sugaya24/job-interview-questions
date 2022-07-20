import { Container } from '@/components/Container';
import Layout from '@/components/Layout';
import { QuestionsCard } from '@/components/QuestionsList';
import { TrendingQuestions } from '@/components/TrendingQuestions';
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
  Heading,
  Spinner,
} from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import React, { ReactElement } from 'react';

export default function questionsPage() {
  const { data, error, size, setSize } = useQuestions();

  if (error) return `An error has occurred. => ${error.message}`;

  if (!data)
    return (
      <Center my={4}>
        <Spinner />
      </Center>
    );

  const questions: any[] = data ? [].concat(...data) : [];
  const isLoading = size > 0 && data && typeof data[size - 1] === 'undefined';
  const isReachingEnd =
    data && data[data.length - 1]?.length < LIMIT_DISPLAY_CONTENT_PER_PAGE;

  return (
    <>
      <NextSeo title={'Question Box'} titleTemplate={'Questions List | %s'} />
      <Container flexGrow={1}>
        <Grid w={`container.xl`} templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={2}>
            <SearchTags />
          </GridItem>
          <GridItem colSpan={7}>
            <Heading>Questions</Heading>
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
          </GridItem>
          <GridItem colSpan={3}>
            <TrendingQuestions />
          </GridItem>
        </Grid>
      </Container>
    </>
  );
}

questionsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
