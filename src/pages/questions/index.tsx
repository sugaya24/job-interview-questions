import { Container } from '@/components/Container';
import Layout from '@/components/Layout';
import { Heading } from '@chakra-ui/react';
import React, { ReactElement } from 'react';

export default function questions() {
  return (
    <Container flexGrow={1}>
      <Heading>Questions</Heading>
    </Container>
  );
}

questions.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
