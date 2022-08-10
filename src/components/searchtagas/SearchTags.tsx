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
import { matchSorter } from 'match-sorter';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';

import { Container } from '../Container';

const LIMIT_SUGGESTION_TAGS = 10;

type Props = {
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
};

const SearchTags = (props: Props) => {
  const { selectedTags, setSelectedTags } = props;
  const router = useRouter();
  const [suggestTags, setSuggestTags] = useState<ITag[]>([]);
  const [sortedTags, setSortedTags] = useState<string[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/tags');
      const data = (await response.json()) as ITag[];
      setSuggestTags(data);
      setSortedTags(
        data.map((item) => item.tagId).slice(0, LIMIT_SUGGESTION_TAGS),
      );
    };
    fetchData();
    return () => {
      fetchData();
    };
  }, []);

  useEffect(() => {
    const sorted = matchSorter(suggestTags, input, { keys: ['tagId'] })
      .map((item) => item.tagId)
      .slice(0, LIMIT_SUGGESTION_TAGS);
    setSortedTags(sorted);
  }, [input]);

  useEffect(() => {
    router.push({
      query: { ...router.query, tags: selectedTags },
    });
  }, [selectedTags]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <Container alignItems={'start'}>
      <Box w={'100%'} mb={'4'}>
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
                  >
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton
                      onClick={() =>
                        setSelectedTags((tags) =>
                          tags.filter((_, j) => i !== j),
                        )
                      }
                    />
                  </Tag>
                </WrapItem>
              ))}
            <InputGroup>
              <Input value={input} onChange={(e) => onChange(e)} />
              <InputRightElement color={'gray.400'}>
                <BiSearch />
              </InputRightElement>
            </InputGroup>
            {sortedTags.length ? (
              <Box>
                <Wrap>
                  {sortedTags.map((tag, i) => (
                    <WrapItem key={i}>
                      <Tag
                        size={'md'}
                        cursor={'pointer'}
                        _hover={{ color: 'blackAlpha.600' }}
                        onClick={() => {
                          setSelectedTags((tags) => {
                            const newTags = new Set(tags);
                            newTags.add(tag);
                            return Array.from(newTags);
                          });
                          setSortedTags((tags) =>
                            tags.filter((t) => t !== tag),
                          );
                          setInput('');
                        }}
                      >
                        <TagLabel>{tag}</TagLabel>
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
