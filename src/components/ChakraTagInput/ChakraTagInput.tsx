import { useAutoCompleteContext } from '@/contexts';
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputProps,
  List,
  ListItem,
  StyleProps,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { normalizeProps, useMachine } from '@zag-js/react';
import * as tagsInput from '@zag-js/tags-input';
import { matchSorter } from 'match-sorter';
import { useEffect, useState } from 'react';

type props = {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
};

const CustomInput = (props: InputProps | StyleProps | any) => {
  const { setIsOpen } = useAutoCompleteContext();
  return (
    <InputGroup onFocus={() => setIsOpen(true)} onBlur={() => setIsOpen(false)}>
      <Input
        w={'200px'}
        placeholder={'Add Tags...'}
        size={'sm'}
        borderRadius={'md'}
        border={'0'}
        {...props.inputProps}
      />
    </InputGroup>
  );
};

const AutoComplete = ({ items }: { items: string[] }) => {
  const { isOpen } = useAutoCompleteContext();
  return (
    <>
      {isOpen && items.length > 0 && (
        <Box
          w={'100%'}
          h={'auto'}
          p={2}
          pos={'absolute'}
          bgColor={'white'}
          zIndex={'popover'}
          top={'100%'}
          border={'1px solid'}
          borderColor={'blackAlpha.400'}
          borderRadius={'md'}
        >
          <List>
            {items.map((item) => (
              <ListItem key={item}>{item}</ListItem>
            ))}
          </List>
        </Box>
      )}
    </>
  );
};

type TTags = {
  id: string;
  name: string;
};
const EXAMPLE_TAGS: TTags[] = [
  {
    id: 'typescript',
    name: 'TypeScript',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
  },
];

export const ChakraTagInput = ({ tags, setTags }: props) => {
  const [sorted, setSorted] = useState<string[]>(
    EXAMPLE_TAGS.map((tag) => tag.id),
  );
  const [state, send] = useMachine(
    tagsInput.machine({
      name: 'tags',
      value: tags || [],
      id: 'id',
      maxLength: 15,
      max: 5,
    }),
  );
  const api = tagsInput.connect(state, send, normalizeProps);

  const handleKeydownArrowUp = (e: { code: string }) => {
    if (e.code === 'ArrowUp') {
      // TODO: select an element in autocomplete suggestions
    }
  };
  const handleKeydownArrowDown = (e: { code: string }) => {
    if (e.code === 'ArrowDown') {
      // TODO: select an element in autocomplete suggestions
    }
  };

  useEffect(() => {
    const tagsIds = EXAMPLE_TAGS.map((tag) => tag.id);
    if (!api.inputValue.length) {
      setSorted([]);
    } else {
      setSorted(matchSorter(tagsIds, api.inputValue));
    }
    window.addEventListener('keydown', handleKeydownArrowUp);
    window.addEventListener('keydown', handleKeydownArrowDown);
    return () => {
      window.removeEventListener('keydown', handleKeydownArrowUp);
      window.removeEventListener('keydown', handleKeydownArrowDown);
    };
  }, [api.inputValue]);

  useEffect(() => {
    setTags([...api.value]);
  }, [api.value]);

  return (
    <Box
      {...api.rootProps}
      p={2}
      mb={4}
      bgColor={'white'}
      border={'1px solid'}
      borderColor={'blackAlpha.400'}
      borderRadius={'2xl'}
    >
      <Wrap {...api.controlProps}>
        {api.value.map((value, index) => (
          <WrapItem as={'span'} key={index}>
            <Box
              display={'inline-block'}
              {...api.getTagProps({ index, value })}
            >
              <Tag size={'lg'}>
                <TagLabel>{value}</TagLabel>
                <TagCloseButton
                  {...api.getTagDeleteButtonProps({
                    disabled: true,
                    index,
                    value,
                  })}
                />
              </Tag>
            </Box>
            <input {...api.getTagInputProps({ index, value })} />
          </WrapItem>
        ))}
        <Flex flexDir={'column'} pos={'relative'} gap={2}>
          <CustomInput sorted={sorted} inputProps={api.inputProps} />
          <AutoComplete items={sorted} />
        </Flex>
      </Wrap>
      <input {...api.hiddenInputProps} />
    </Box>
  );
};

export default ChakraTagInput;
