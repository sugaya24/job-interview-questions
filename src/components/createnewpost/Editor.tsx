import { Box, Divider } from '@chakra-ui/react';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { TRANSFORMERS } from '@lexical/markdown';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
// OnChangePlugin
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import type { EditorState, LexicalEditor } from 'lexical';
import React from 'react';

import customTheme from './customTheme';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';

// import TreeViewPlugin from './plugins/TreeViewPlugin';

function Placeholder() {
  return (
    <Box
      className="editor-placeholder"
      top={12}
      left={12}
      pos={'absolute'}
      display={'inline-block'}
      color={'GrayText'}
      overflow={'hidden'}
      textOverflow={'ellipsis'}
      pointerEvents={'none'}
    >
      Enter your post content here...
    </Box>
  );
}

const editorConfig = {
  // The editor theme
  theme: customTheme,
  // Handling of errors during update
  onError(error) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
};

type Props = {
  onChange: (editorState: EditorState, editor: LexicalEditor) => void;
};

export default function Editor({ onChange }: Props) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <Box
        className="editor-container"
        h={'100%'}
        w={'100%'}
        flexGrow={1}
        display={'flex'}
        flexDir={'column'}
        border={'1px'}
        borderColor={'blackAlpha.400'}
        borderRadius={'2xl'}
      >
        <ToolbarPlugin />
        <Divider />
        <Box
          className="editor-inner"
          h={'100%'}
          minH={'0'}
          w={'100%'}
          flexGrow={1}
          pos={'relative'}
          flexWrap={'nowrap'}
          overflowY={'auto'}
        >
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
          />
          <OnChangePlugin onChange={onChange} />
          <HistoryPlugin />
          {/* <TreeViewPlugin /> */}
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </Box>
      </Box>
    </LexicalComposer>
  );
}
