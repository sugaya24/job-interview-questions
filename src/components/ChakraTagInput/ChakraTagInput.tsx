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
  useToast,
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
        {...props.inputProps}
        // override onKeyDown in inputProps
        onKeyDown={() => {}}
      />
    </InputGroup>
  );
};

const AutoComplete = ({
  items,
  addValue,
  inputValue,
}: {
  items: string[];
  addValue: (value: string) => void;
  inputValue: string;
}) => {
  const { isOpen, cursorIdx, setCursorIdx } = useAutoCompleteContext();

  return (
    <>
      {isOpen && items.length > 0 && inputValue.length > 1 && (
        <Box
          w={'100%'}
          h={'auto'}
          pos={'absolute'}
          bgColor={'white'}
          zIndex={'popover'}
          top={'100%'}
          border={'1px solid'}
          borderColor={'blackAlpha.400'}
          borderRadius={'md'}
        >
          <List>
            {items.map((item, i) => (
              <ListItem
                p={2}
                key={item}
                role={'option'}
                aria-selected={i === cursorIdx}
                cursor={'pointer'}
                _selected={{ bgColor: 'gray.200' }}
                onMouseDown={() => addValue(item)}
                onMouseEnter={() => setCursorIdx(i)}
              >
                {item}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </>
  );
};

export const ChakraTagInput = ({ tags, setTags }: props) => {
  const toast = useToast();
  const [sorted, setSorted] = useState<string[]>([]);
  const { cursorIdx, setCursorIdx, isOpen, tagsList } =
    useAutoCompleteContext();
  const [state, send] = useMachine(
    tagsInput.machine({
      name: 'tags',
      value: tags || [],
      id: 'id',
      maxLength: 15,
      max: 5,
      validate: ({
        inputValue,
        values,
      }: {
        inputValue: string;
        values: string[];
      }) => {
        if (values.includes(inputValue)) {
          toast({
            status: 'error',
            title: 'The tag is already added.',
            isClosable: true,
            duration: 5000,
            position: 'top-left',
          });
          return false;
        }
        return true;
      },
    }),
  );
  const api = tagsInput.connect(state, send, normalizeProps);

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.code === 'ArrowUp') {
      if (isOpen && cursorIdx > 0) {
        setCursorIdx((prev) => --prev);
      }
    }
    if (e.code === 'ArrowDown') {
      if (isOpen && cursorIdx < sorted.length - 1) {
        setCursorIdx((prev) => ++prev);
      }
    }
    if (e.code === 'Enter') {
      if (isOpen && cursorIdx > -1) {
        e.preventDefault();
        api.addValue(sorted[cursorIdx]);
      } else if (api.inputValue) {
        api.addValue(api.inputValue);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [sorted, cursorIdx, isOpen]);

  useEffect(() => {
    setCursorIdx(-1);
    const tagsIds = tagsList.map((tag) => tag.tagId);
    if (!api.inputValue.length) {
      setSorted([]);
    } else {
      setSorted(matchSorter(tagsIds, api.inputValue).slice(0, 5));
    }
  }, [api.inputValue, tagsList]);

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
          <AutoComplete
            items={sorted}
            addValue={api.addValue}
            inputValue={api.inputValue}
          />
        </Flex>
      </Wrap>
      <input {...api.hiddenInputProps} />
    </Box>
  );
};

export default ChakraTagInput;
