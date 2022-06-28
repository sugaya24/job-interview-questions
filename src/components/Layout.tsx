import { Box, theme } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

import { Footer } from './Footer';
import Navbar from './Navbar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Box h={'100vh'} display={'flex'} flexDir={'column'}>
      <Navbar />
      {children}
      <Footer top={'100%'} pos={'sticky'} bg={theme.colors.gray[50]} />
    </Box>
  );
}
