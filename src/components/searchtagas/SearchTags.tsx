import { ITag } from '@/models/Tag';
import {
  Box,
  Center,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Tag,
  TagCloseButton,
  TagLabel,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';

import { Container } from '../Container';

const SearchTags = () => {
  const [suggestTags, setSuggestTags] = useState<ITag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/tags');
      const data = await response.json();
      setSuggestTags(data);
    };
    fetchData();
    return () => {
      fetchData();
    };
  }, []);

  return (
    <Container alignItems={'start'} p={'2'}>
      <Box w={'100%'} p={'2'} mb={'4'}>
        <Heading mb={'4'} size={'md'}>
          Tags
        </Heading>
        <Box
          w={'100%'}
          p={2}
          border={'1px'}
          borderColor={'blackAlpha.400'}
          borderRadius={'md'}
          bgColor={'white'}
        >
          <VStack w={'100%'} alignItems={'start'}>
            {selectedTags &&
              selectedTags.map((tag, i) => (
                <WrapItem key={i}>
                  <Tag
                    size={'md'}
                    colorScheme={'blackAlpha'}
                    cursor={'pointer'}
                    _hover={{ color: 'blackAlpha.600' }}
                    onClick={() =>
                      setSelectedTags((tags) => tags.filter((_, j) => i !== j))
                    }
                  >
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton />
                  </Tag>
                </WrapItem>
              ))}
            <InputGroup>
              <Input />
              <InputRightElement color={'gray.400'}>
                <BiSearch />
              </InputRightElement>
            </InputGroup>
            {suggestTags.length ? (
              <Box>
                <Wrap>
                  {suggestTags.map((tag, i) => (
                    <WrapItem key={i}>
                      <Tag
                        size={'md'}
                        cursor={'pointer'}
                        _hover={{ color: 'blackAlpha.600' }}
                        onClick={() =>
                          setSelectedTags((tags) => [...tags, tag.tagId])
                        }
                      >
                        <TagLabel>{tag.tagId}</TagLabel>
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            ) : (
              <Center w={'100%'}>no tags...</Center>
            )}
          </VStack>
        </Box>
      </Box>
    </Container>
  );
};

export default SearchTags;
