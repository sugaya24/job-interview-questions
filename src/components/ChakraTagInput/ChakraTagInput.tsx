import {
  Box,
  HStack,
  Input,
  InputProps,
  Tag,
  TagCloseButton,
  TagLabel,
} from '@chakra-ui/react';
import { normalizeProps, useMachine } from '@zag-js/react';
import * as tagsInput from '@zag-js/tags-input';
import { useEffect } from 'react';

type props = {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
};

const CustomInput = (props: InputProps | any) => {
  return <Input {...props} />;
};

export const ChakraTagInput = ({ tags, setTags }: props) => {
  const [state, send] = useMachine(
    tagsInput.machine({ name: 'tags', value: tags || [], id: 'id' }),
  );
  const api = tagsInput.connect(state, send, normalizeProps);

  useEffect(() => {
    setTags([...api.value]);
  }, [api.value]);

  return (
    <Box {...api.rootProps} mb={4}>
      <HStack gap={1} {...api.controlProps}>
        {api.value.map((value, index) => (
          <Box as={'span'} key={index}>
            <Box
              display={'inline-block'}
              gap={1}
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
          </Box>
        ))}
        <CustomInput
          w={'auto'}
          placeholder={'Add Tags...'}
          border={'0'}
          {...api.inputProps}
        />
      </HStack>
      <CustomInput {...api.hiddenInputProps} />
    </Box>
  );
};

export default ChakraTagInput;
