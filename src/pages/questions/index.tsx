import { Question } from '@/common';
import { Container } from '@/components/Container';
import Layout from '@/components/Layout';
import { QuestionsCard } from '@/components/QuestionsList';
import { TrendingQuestions } from '@/components/TrendingQuestions';
import { SearchTags } from '@/components/searchtagas';
import { useAuthContext } from '@/contexts';
import { useQuestions } from '@/hooks';
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

export default function questionsPage() {
  const { isLoading } = useAuthContext();
  const { data, error } = useQuestions();
  const [questionList, setQuestionList] = useState(null);

  if (error) return `An error has occurred. => ${error.message}`;

  useEffect(() => {
    if (!data) {
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
          data.questions.map(
            (
              question: Question & {
                createdAt: Date;
                updatedAt: Date;
              },
            ) => (
              <Box key={question.questionId}>
                <QuestionsCard w={'100%'} question={question} />
                <Divider />
              </Box>
            ),
          ),
        );
      }
    }
  }, [data]);

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
