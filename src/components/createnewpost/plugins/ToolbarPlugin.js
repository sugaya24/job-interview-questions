import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Divider,
  HStack,
  IconButton,
  VStack,
} from '@chakra-ui/react';
import {
  $createCodeNode,
  $isCodeNode,
  getCodeLanguages,
  getDefaultCodeLanguage,
} from '@lexical/code';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text';
import {
  $isAtNodeEnd,
  $isParentElementRTL,
  $wrapLeafNodesInElements,
} from '@lexical/selection';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import {
  BiAlignJustify,
  BiAlignMiddle,
  BiBold,
  BiCode,
  BiItalic,
  BiLeftIndent,
  BiLink,
  BiRedo,
  BiRightIndent,
  BiStrikethrough,
  BiUnderline,
  BiUndo,
} from 'react-icons/bi';
import {
  FaCode,
  FaHeading,
  FaListOl,
  FaListUl,
  FaQuoteLeft,
} from 'react-icons/fa';
import { RiArrowDropDownLine } from 'react-icons/ri';

const LowPriority = 1;

const supportedBlockTypes = new Set([
  'paragraph',
  'quote',
  'code',
  'h1',
  'h2',
  'ul',
  'ol',
]);

const blockTypeToBlockName = {
  code: 'Code Block',
  h1: 'Large Heading',
  h2: 'Small Heading',
  h3: 'Heading',
  h4: 'Heading',
  h5: 'Heading',
  ol: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
  ul: 'Bulleted List',
};

function positionEditorElement(editor, rect) {
  if (rect === null) {
    editor.style.opacity = '0';
    editor.style.top = '-1000px';
    editor.style.left = '-1000px';
  } else {
    editor.style.opacity = '1';
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
    editor.style.left = `${
      rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
    }px`;
  }
}

function FloatingLinkEditor({ editor }) {
  const editorRef = useRef(null);
  const inputRef = useRef(null);
  const mouseDownRef = useRef(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState(null);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl('');
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect;
      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect);
      }
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== 'link-input') {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl('');
    }

    return true;
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        LowPriority,
      ),
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  return (
    <div ref={editorRef} className="link-editor">
      {isEditMode ? (
        <input
          ref={inputRef}
          className="link-input"
          value={linkUrl}
          onChange={(event) => {
            setLinkUrl(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              if (lastSelection !== null) {
                if (linkUrl !== '') {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                }
                setEditMode(false);
              }
            } else if (event.key === 'Escape') {
              event.preventDefault();
              setEditMode(false);
            }
          }}
        />
      ) : (
        <>
          <div className="link-input">
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              {linkUrl}
            </a>
            <div
              className="link-edit"
              role="button"
              tabIndex={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setEditMode(true);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

function Select({ onChange, className, options, value }) {
  return (
    <select className={className} onChange={onChange} value={value}>
      <option hidden={true} value="" />
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function getSelectedNode(selection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

function BlockOptionsDropdownList({
  editor,
  blockType,
  toolbarRef,
  setShowBlockOptionsDropDown,
}) {
  const dropDownRef = useRef(null);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    const dropDown = dropDownRef.current;

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect();
      dropDown.style.top = `${top + 40}px`;
      dropDown.style.left = `${left}px`;
    }
  }, [dropDownRef, toolbarRef]);

  useEffect(() => {
    const dropDown = dropDownRef.current;
    const toolbar = toolbarRef.current;

    if (dropDown !== null && toolbar !== null) {
      const handle = (event) => {
        const target = event.target;

        if (!dropDown.contains(target) && !toolbar.contains(target)) {
          setShowBlockOptionsDropDown(false);
        }
      };
      document.addEventListener('click', handle);

      return () => {
        document.removeEventListener('click', handle);
      };
    }
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);

  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createParagraphNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatLargeHeading = () => {
    if (blockType !== 'h1') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createHeadingNode('h1'));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatSmallHeading = () => {
    if (blockType !== 'h2') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createHeadingNode('h2'));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatBulletList = () => {
    if (blockType !== 'ul') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatNumberedList = () => {
    if (blockType !== 'ol') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createQuoteNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createCodeNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  return (
    <VStack
      w={'sm'}
      p={2}
      gap={0}
      spacing={0}
      className="dropdown"
      ref={dropDownRef}
      pos={'absolute'}
      bgColor={'white'}
      boxShadow={'md'}
      rounded={'md'}
    >
      <ButtonGroup w={'100%'}>
        <Button
          w={'100%'}
          bgColor={'white'}
          fontWeight={'400'}
          justifyContent={'flex-start'}
          leftIcon={<HamburgerIcon />}
          onClick={formatParagraph}
        >
          Normal
        </Button>
        {blockType === 'paragraph' && <span className={'active'} />}
      </ButtonGroup>
      <ButtonGroup w={'100%'}>
        <Button
          w={'100%'}
          bgColor={'white'}
          fontWeight={'400'}
          justifyContent={'flex-start'}
          leftIcon={<FaHeading />}
          onClick={formatLargeHeading}
        >
          Large Heading
        </Button>
        {blockType === 'h1' && <span className="active" />}
      </ButtonGroup>
      <ButtonGroup w={'100%'}>
        <Button
          w={'100%'}
          bgColor={'white'}
          fontWeight={'400'}
          justifyContent={'flex-start'}
          leftIcon={<FaHeading />}
          onClick={formatSmallHeading}
        >
          Small Heading
        </Button>
        {blockType === 'h2' && <span className="active" />}
      </ButtonGroup>
      <ButtonGroup w={'100%'}>
        <Button
          w={'100%'}
          bgColor={'white'}
          fontWeight={'400'}
          justifyContent={'flex-start'}
          leftIcon={<FaListUl />}
          onClick={formatBulletList}
        >
          Bullet List
        </Button>
        {blockType === 'ul' && <span className="active" />}
      </ButtonGroup>
      <ButtonGroup w={'100%'}>
        <Button
          w={'100%'}
          bgColor={'white'}
          fontWeight={'400'}
          justifyContent={'flex-start'}
          leftIcon={<FaListOl />}
          onClick={formatNumberedList}
        >
          Numbered List
        </Button>
        {blockType === 'ol' && <span className="active" />}
      </ButtonGroup>
      <ButtonGroup w={'100%'}>
        <Button
          w={'100%'}
          bgColor={'white'}
          fontWeight={'400'}
          justifyContent={'flex-start'}
          leftIcon={<FaQuoteLeft />}
          onClick={formatQuote}
        >
          Quote
        </Button>
        {blockType === 'quote' && <span className="active" />}
      </ButtonGroup>
      <ButtonGroup w={'100%'}>
        <Button
          w={'100%'}
          bgColor={'white'}
          fontWeight={'400'}
          justifyContent={'flex-start'}
          leftIcon={<FaCode />}
          onClick={formatCode}
        >
          Code Block
        </Button>
        {blockType === 'code' && <span className="active" />}
      </ButtonGroup>
    </VStack>
  );
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [selectedElementKey, setSelectedElementKey] = useState(null);
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] =
    useState(false);
  const [codeLanguage, setCodeLanguage] = useState('');
  const [isRTL, setIsRTL] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [currentBlockTypeIcon, setCurrentBlockTypeIcon] = useState(
    <HamburgerIcon />,
  );

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
          if ($isCodeNode(element)) {
            setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
          }
        }
      }
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, updateToolbar]);

  const codeLanguges = useMemo(() => getCodeLanguages(), []);
  const onCodeLanguageSelect = useCallback(
    (e) => {
      editor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(e.target.value);
          }
        }
      });
    },
    [editor, selectedElementKey],
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  useEffect(() => {
    const currentBlockTypeIcon = (blockType) => {
      if (blockType === 'paragraph') {
        setCurrentBlockTypeIcon(<HamburgerIcon />);
      } else if (blockType === 'h1') {
        setCurrentBlockTypeIcon(<FaHeading />);
      } else if (blockType === 'h2') {
        setCurrentBlockTypeIcon(<FaHeading />);
      } else if (blockType === 'ul') {
        setCurrentBlockTypeIcon(<FaListUl />);
      } else if (blockType === 'ol') {
        setCurrentBlockTypeIcon(<FaListOl />);
      } else if (blockType === 'quote') {
        setCurrentBlockTypeIcon(<FaQuoteLeft />);
      } else if (blockType === 'code') {
        setCurrentBlockTypeIcon(<FaCode />);
      }
    };
    currentBlockTypeIcon(blockType);
  }, [blockType]);

  return (
    <Box
      className="toolbar"
      p={2}
      bgColor={'white'}
      ref={toolbarRef}
      display={'flex'}
      flexDir={'row'}
      borderRadius={'2xl'}
    >
      <IconButton
        variant={'none'}
        disabled={!canUndo}
        icon={<BiUndo />}
        aria-label={'Undo'}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND);
        }}
      />

      <IconButton
        variant={'none'}
        disabled={!canRedo}
        icon={<BiRedo />}
        aria-label={'Redo'}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND);
        }}
      />
      <Center>
        <Divider mx={2} orientation="vertical" />
      </Center>
      {supportedBlockTypes.has(blockType) && (
        <>
          <Button
            variant={'outline'}
            leftIcon={currentBlockTypeIcon}
            rightIcon={<RiArrowDropDownLine />}
            bgColor={'white'}
            onClick={() =>
              setShowBlockOptionsDropDown(!showBlockOptionsDropDown)
            }
          >
            {blockTypeToBlockName[blockType]}
          </Button>
          {showBlockOptionsDropDown &&
            createPortal(
              <BlockOptionsDropdownList
                editor={editor}
                blockType={blockType}
                toolbarRef={toolbarRef}
                setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
              />,
              document.body,
            )}
          <Center>
            <Divider mx={2} orientation="vertical" />
          </Center>
        </>
      )}
      {blockType === 'code' ? (
        <>
          <Select
            className="toolbar-item code-language"
            onChange={onCodeLanguageSelect}
            options={codeLanguges}
            value={codeLanguage}
          />
        </>
      ) : (
        <HStack>
          <IconButton
            variant={'outline'}
            icon={<BiBold />}
            bgColor={isBold ? 'gray.100' : 'white'}
            aria-label={'Format Bold'}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }}
          />
          <IconButton
            variant={'outline'}
            icon={<BiItalic />}
            bgColor={isItalic ? 'gray.100' : 'white'}
            aria-label={'Format Italics'}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            }}
          />
          <IconButton
            variant={'outline'}
            icon={<BiUnderline />}
            bgColor={isUnderline ? 'gray.100' : 'white'}
            aria-label={'Format Underline'}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            }}
          />
          <IconButton
            variant={'outline'}
            icon={<BiStrikethrough />}
            bgColor={isStrikethrough ? 'gray.100' : 'white'}
            aria-label={'Format Strikethrough'}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
            }}
          />
          <IconButton
            variant={'outline'}
            icon={<BiCode />}
            bgColor={isCode ? 'gray.100' : 'white'}
            aria-label={'Insert Code'}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
            }}
          />
          <IconButton
            variant={'outline'}
            icon={<BiLink />}
            bgColor={isLink ? 'gray.100' : 'white'}
            aria-label={'Insert Link'}
            onClick={insertLink}
          />
          {isLink &&
            createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
          <Divider mx={2} orientation="vertical" />
          <IconButton
            variant={'outline'}
            icon={<BiLeftIndent />}
            bgColor={isLink ? 'gray.100' : 'white'}
            aria-label={'Left Align'}
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
            }
          />
          <IconButton
            variant={'outline'}
            icon={<BiAlignMiddle />}
            bgColor={isLink ? 'gray.100' : 'white'}
            aria-label={'Center Align'}
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
            }
          />
          <IconButton
            variant={'outline'}
            icon={<BiRightIndent />}
            bgColor={isLink ? 'gray.100' : 'white'}
            aria-label={'Right Align'}
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
            }
          />
          <IconButton
            variant={'outline'}
            icon={<BiAlignJustify />}
            bgColor={isLink ? 'gray.100' : 'white'}
            aria-label={'Justify Align'}
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
            }
          />
        </HStack>
      )}
    </Box>
  );
}
