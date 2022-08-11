import { useInputFocusContext } from '@/contexts/InputFocusContext';
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
import React, { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { BiSearch } from 'react-icons/bi';

function Searchbar(props: StyleProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { isFocus, setIsFocus } = useInputFocusContext();
  const [value, setValue] = useState('');

  useHotkeys(
    '/',
    () => {
      setIsFocus(true);
    },
    { keyup: true },
  );
  useHotkeys(
    'escape',
    () => {
      setIsFocus(false);
    },
    { enableOnTags: ['INPUT'] },
  );

  useEffect(() => {
    if (isFocus) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [isFocus]);

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
          ref={inputRef}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />
        <InputRightElement>
          <Kbd color={'blackAlpha.600'}>/</Kbd>
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
}

export default Searchbar;
