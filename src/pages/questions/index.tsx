import { Question } from '@/common';
import { Container } from '@/components/Container';
import Layout from '@/components/Layout';
import { QuestionsCard } from '@/components/QuestionsList';
import { TrendingQuestions } from '@/components/TrendingQuestions';
import { SearchTags } from '@/components/searchtagas';
import { useAuthContext } from '@/contexts';
import {
  Box,
  Center,
  Divider,
  Grid,
  GridItem,
  Heading,
  Spinner,
} from '@chakra-ui/react';
import React, { ReactElement, useEffect, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json());

export default function questionsPage() {
  const { isLoading } = useAuthContext();
  const [questionList, setQuestionList] = useState(null);
  const { data, error } = useSWR(`/api/questions`, fetcher);

  if (error) return 'An error has occurred.';

  useEffect(() => {
    if (isLoading || !data) {
      setQuestionList(
        <Center py={4}>
          <Spinner />
        </Center>,
      );
    } else {
      if (data.questions.length === 0) {
        setQuestionList(<Center>no data</Center>);
      } else {
        setQuestionList(
          data.questions.map((question: Question) => (
            <Box key={question.questionId}>
              <QuestionsCard w={'100%'} question={question} />
              <Divider />
            </Box>
          )),
        );
      }
    }
  }, [isLoading]);

  return (
    <Container flexGrow={1}>
      <Grid w={`container.xl`} templateColumns="repeat(12, 1fr)" gap={4}>
        <GridItem colSpan={2}>
          <SearchTags />
        </GridItem>
        <GridItem colSpan={7}>
          <Heading>Questions</Heading>
          {questionList}
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
