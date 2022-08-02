import { User } from '@/common';
import { Box, Button, HStack, Input } from '@chakra-ui/react';
import { EditorState, LexicalEditor } from 'lexical';
import React, { Dispatch } from 'react';

import { ChakraTagInput } from './ChakraTagInput';
import { Editor } from './createnewpost';

type Props = {
  title: string;
  setTitle: Dispatch<React.SetStateAction<string>>;
  tags: string[];
  setTags: Dispatch<React.SetStateAction<string[]>>;
  onChange: (editorState: EditorState, editor: LexicalEditor) => void;
  editorState: EditorState | undefined;
  currentUser: User | null | undefined;
  isPosting: boolean;
  hasContent: boolean;
  postContent: () => Promise<void>;
};

const EditorBlock = (props: Props) => {
  const {
    title,
    setTitle,
    tags,
    setTags,
    currentUser,
    editorState,
    hasContent,
    isPosting,
    onChange,
    postContent,
  } = props;

  return (
    <Box
      w={'container.lg'}
      h={'100%'}
      flexGrow={1}
      display={'flex'}
      flexDir={'column'}
    >
      <Input
        w={'100%'}
        mb={4}
        value={title}
        outline={'none'}
        size={'lg'}
        fontSize={'lg'}
        focusBorderColor={'none'}
        bgColor={'white'}
        placeholder={'Title'}
        onChange={(e) => setTitle(e.target.value)}
      />
      <ChakraTagInput tags={tags} setTags={setTags} />
      <Editor onChange={onChange} initialEditorState={editorState} />
      <HStack mt={4}>
        <Button
          isDisabled={!currentUser || isPosting || !hasContent || !title}
          isLoading={isPosting}
          colorScheme={'blue'}
          onClick={postContent}
        >
          Post
        </Button>
      </HStack>
    </Box>
  );
};

export default EditorBlock;
