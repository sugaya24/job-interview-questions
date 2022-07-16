import { Question } from '@/common';
import { Container } from '@/components/Container';
import Layout from '@/components/Layout';
import { Pagination } from '@/components/Pagination';
import { QuestionsCard } from '@/components/QuestionsList';
import { TrendingQuestions } from '@/components/TrendingQuestions';
import { SearchTags } from '@/components/searchtagas';
import { LIMIT_DISPLAY_CONTENT_PER_PAGE } from '@/constant';
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
import { NextSeo } from 'next-seo';
import React, { ReactElement, useEffect, useState } from 'react';

export default function questionsPage() {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [questionList, setQuestionList] = useState<any>(null);
  const { data, error } = useQuestions(pageIndex.toString());

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
              index: number,
            ) => (
              <Box key={question.questionId}>
                <QuestionsCard w={'100%'} question={question} />
                {index !== LIMIT_DISPLAY_CONTENT_PER_PAGE - 1 && <Divider />}
              </Box>
            ),
          ),
        );
      }
    }
  }, [data]);

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
            {questionList}
          </GridItem>
          <GridItem colSpan={3}>
            <TrendingQuestions />
          </GridItem>
        </Grid>
        <Pagination
          hasNextPage={data?.hasNextPage}
          hasPrevPage={data?.hasPrevPage}
          page={data?.page}
          totalPages={data?.totalPages}
          pagingCounter={data?.pagingCounter}
          setPageIndex={setPageIndex}
          // totalDocs={data?.totalDocs}
          // limit={data?.limit}
          // prevPage={data?.prevPage}
        />
      </Container>
    </>
  );
}

questionsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
