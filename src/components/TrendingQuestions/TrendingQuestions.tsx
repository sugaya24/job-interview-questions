import { Box, Divider, HStack, Heading } from '@chakra-ui/react';
import React from 'react';
import { HiTrendingUp } from 'react-icons/hi';

import { Container } from '../Container';
import QuestionsCard from './QuestionsCard';

const questions = [{}, {}, {}];

const TrendingQuestions = () => {
  return (
    <Container mt={6}>
      <Box
        w={'100%'}
        bgColor={'white'}
        rounded={'md'}
        border={'1px solid'}
        borderColor={'blackAlpha.300'}
      >
        <HStack>
          <Heading p={2} size={'lg'}>
            Trending
          </Heading>
          <HiTrendingUp size={'36px'} />
        </HStack>
        <Divider />
        {questions.map((question, index) => (
          <>
            <QuestionsCard />
            {questions.length - 1 !== index && <Divider />}
          </>
        ))}
      </Box>
    </Container>
  );
};

export default TrendingQuestions;
