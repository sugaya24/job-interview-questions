import { Container } from '@/components/Container';
import Layout from '@/components/Layout';
import { Editor } from '@/components/createnewpost';
import { Box, Button, HStack } from '@chakra-ui/react';
import { $generateHtmlFromNodes } from '@lexical/html';
// import parse from 'html-react-parser';
import type { EditorState, LexicalEditor } from 'lexical';
import React, { ReactElement, useState } from 'react';

const createNewPost = () => {
  const [htmlString, setHtmlString] = useState<string>('');

  function onChange(_editorState: EditorState, editor: LexicalEditor) {
    editor.update(() => {
      const htmlFromNodes = $generateHtmlFromNodes(editor);
      setHtmlString(htmlFromNodes);
    });
  }

  return (
    <Container py={4} flexGrow={1}>
      <Box
        w={'container.lg'}
        h={'100%'}
        flexGrow={1}
        display={'flex'}
        flexDir={'column'}
      >
        <Editor onChange={onChange} />
        <HStack mt={4}>
          <Button colorScheme={'blue'}>Post</Button>
          <Button variant={'outline'} colorScheme={'yellow'}>
            Save Draft
          </Button>
        </HStack>
      </Box>
    </Container>
  );
};

export default createNewPost;
createNewPost.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
