import { Button } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { BsPencilSquare } from 'react-icons/bs';

const CreatePostButton = () => {
  return (
    <Button
      variant={'outline'}
      colorScheme={'messenger'}
      rightIcon={<BsPencilSquare />}
    >
      <NextLink href={`/new`}>New Post</NextLink>
    </Button>
  );
};

export default CreatePostButton;
