import { Container } from '@/components/Container';
import Layout from '@/components/Layout';
import { QuestionsCard } from '@/components/QuestionsList';
import { TrendingQuestions } from '@/components/TrendingQuestions';
import { SearchTags } from '@/components/searchtagas';
import { Box, Divider, Grid, GridItem, Heading } from '@chakra-ui/react';
import React, { ReactElement } from 'react';

const questions = [
  {
    id: '1',
    content: '',
  },
  {
    id: '2',
    content: '',
  },
  {
    id: '3',
    content: '',
  },
  {
    id: '4',
    content: '',
  },
  {
    id: '5',
    content: '',
  },
  {
    id: '6',
    content: '',
  },
];

export default function questionsPage() {
  return (
    <Container flexGrow={1}>
      <Grid w={`container.xl`} templateColumns="repeat(12, 1fr)" gap={4}>
        <GridItem colSpan={2}>
          <SearchTags />
        </GridItem>
        <GridItem colSpan={7}>
          <Heading>Questions</Heading>
          {questions.map((question) => (
            <Box key={question.id}>
              <QuestionsCard w={'100%'} questionId={question.id} />
              <Divider />
            </Box>
          ))}
        </GridItem>
        <GridItem colSpan={3}>
          <TrendingQuestions />
        </GridItem>
      </Grid>
    </Container>
  );
}

questionsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
