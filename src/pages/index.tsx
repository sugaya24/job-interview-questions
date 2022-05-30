import Layout from '@/components/Layout';
import { Code, Text } from '@chakra-ui/react';
import React, { ReactElement } from 'react';

import { Container } from '../components/Container';
import { Hero } from '../components/Hero';
import { Main } from '../components/Main';

export default function home() {
  return (
    <Container flexGrow={1}>
      <Hero />
      <Main>
        <Text color="text">
          Example repository of <Code>Next.js</Code> + <Code>chakra-ui</Code> +{' '}
          <Code>TypeScript</Code>.
        </Text>
      </Main>
    </Container>
  );
}

home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
