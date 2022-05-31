import { Box, Button, Kbd, Spacer, StyleProps } from '@chakra-ui/react';
import React from 'react';
import { BiSearch } from 'react-icons/bi';

const Searchbar = (props: StyleProps) => {
  return (
    <Button
      w={`100%`}
      bgColor={`white`}
      shadow={`base`}
      color={`gray.400`}
      fontWeight={`normal`}
      leftIcon={<BiSearch />}
      rightIcon={
        <Box display={{ base: `none`, md: `block` }}>
          <Kbd>⌘</Kbd> <Kbd>K</Kbd>
        </Box>
      }
      _hover={{ backgroundColor: `white` }}
      {...props}
    >
      Search
      <Spacer />
    </Button>
  );
};

export default Searchbar;
