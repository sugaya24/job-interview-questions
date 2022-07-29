import {
  Box,
  Input,
  InputProps,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { normalizeProps, useMachine } from '@zag-js/react';
import * as tagsInput from '@zag-js/tags-input';
import { useEffect } from 'react';

type props = {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
};

const CustomInput = (props: InputProps | any) => {
  return <Input size={'sm'} borderRadius={'md'} {...props} />;
};

export const ChakraTagInput = ({ tags, setTags }: props) => {
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
      <Wrap gap={1} {...api.controlProps}>
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
            <CustomInput {...api.getTagInputProps({ index, value })} />
          </WrapItem>
        ))}
        <CustomInput
          w={'auto'}
          placeholder={'Add Tags...'}
          border={'0'}
          {...api.inputProps}
        />
      </Wrap>
      <CustomInput {...api.hiddenInputProps} />
    </Box>
  );
};

export default ChakraTagInput;
