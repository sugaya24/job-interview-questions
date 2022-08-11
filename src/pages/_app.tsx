import { AuthProvider, AutoCompleteContextProvider } from '@/contexts';
import { InputFocusContextProvider } from '@/contexts/InputFocusContext';
import { ChakraProvider } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { DefaultSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import React from 'react';
import type { ReactElement, ReactNode } from 'react';

import theme from '../theme';
import './style.css';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <AuthProvider>
      <AutoCompleteContextProvider>
        <InputFocusContextProvider>
          <ChakraProvider resetCSS theme={theme}>
            <DefaultSeo
              defaultTitle={'Question Box'}
              description={
                'Question Box is the community that you can ask anything about tech.'
              }
            />
            {getLayout(<Component {...pageProps} />)}
          </ChakraProvider>
        </InputFocusContextProvider>
      </AutoCompleteContextProvider>
    </AuthProvider>
  );
}
