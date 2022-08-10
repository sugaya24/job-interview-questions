import {
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Kbd,
  StyleProps,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { BiSearch } from 'react-icons/bi';

function Searchbar(props: StyleProps) {
  const router = useRouter();
  const [value, setValue] = useState('');

  return (
    <FormControl {...props}>
      <InputGroup>
        <InputLeftElement color={'gray.400'}>
          <BiSearch />
        </InputLeftElement>
        <Input
          type={'text'}
          bgColor={'white'}
          color={'blackAlpha.800'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.code === 'Enter') {
              router.push({
                query: { ...router.query, q: encodeURI(value) },
              });
              // setValue('');
            }
          }}
        />
        <InputRightElement>
          <Kbd color={'blackAlpha.600'}>/</Kbd>
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
}

export default Searchbar;
