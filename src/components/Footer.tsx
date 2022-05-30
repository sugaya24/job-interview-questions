import { Center, Flex, FlexProps, Text, theme } from '@chakra-ui/react';
import React from 'react';

export const Footer = (props: FlexProps) => {
  return (
    <Flex
      as={'footer'}
      w={'100%'}
      h={'50px'}
      borderTop={`1px`}
      borderColor={'gray.200'}
      _dark={{
        bg: 'gray.900',
        color: 'white',
        borderColor: 'gray.800',
      }}
      {...props}
    >
      <Center w={'100%'}>
        <Text color={'GrayText'} fontSize={'sm'}>
          Made by Yuki Suagya
        </Text>
      </Center>
    </Flex>
  );
};
