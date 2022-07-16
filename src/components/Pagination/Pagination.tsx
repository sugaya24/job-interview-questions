import { QuestionDocument } from '@/models/Question';
import { Button, ButtonGroup, HStack, IconButton } from '@chakra-ui/react';
import { PaginateResult } from 'mongoose';
import React from 'react';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

type Props = Pick<
  PaginateResult<QuestionDocument>,
  'hasPrevPage' | 'hasNextPage' | 'page' | 'totalPages' | 'pagingCounter'
  // | 'totalDocs'
  // | 'limit'
  // | 'prevPage'
> & {
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
};

const Pagination = (props: Props) => {
  const { totalPages, hasPrevPage, hasNextPage, page, setPageIndex } = props;

  return (
    <HStack my={8}>
      <IconButton
        disabled={!hasPrevPage}
        icon={<IoChevronBackOutline />}
        aria-label={'go prev page'}
        onClick={() => setPageIndex((prev) => prev - 1)}
      />
      {[...Array(totalPages)].map((_, i) => (
        <ButtonGroup key={i}>
          <Button onClick={() => setPageIndex(i + 1)}>{i + 1}</Button>
        </ButtonGroup>
      ))}
      <IconButton
        disabled={!hasNextPage}
        icon={<IoChevronForwardOutline />}
        aria-label={'go next page'}
        onClick={() => setPageIndex((prev) => prev + 1)}
      />
    </HStack>
  );
};

export default Pagination;
