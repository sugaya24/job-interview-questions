import { useAuthContext } from '@/contexts';
import { login, logout } from '@/firebase';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Link as ChakraLink,
  Flex,
  HStack,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import CreatePostButton from './CreatePostButton';
import Searchbar from './common/Searchbar';

const Links = [
  {
    title: 'Questions',
    href: 'questions',
  },
];

const NavLink = ({
  children,
}: {
  children: { title: string; href: string };
  key: string;
}) => (
  <NextLink href={`/${children.href}`} passHref>
    <ChakraLink
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
    >
      {children.title}
    </ChakraLink>
  </NextLink>
);

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser } = useAuthContext();

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>
              <Heading fontSize={'xl'}>
                <NextLink href={'/'}>Question Box</NextLink>
              </Heading>
            </Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {Links.map((link) => (
                <NavLink key={link.title}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <HStack>
              <Searchbar w={`300px`} display={{ base: `none`, md: `flex` }} />
              {currentUser && <CreatePostButton />}
              <Menu>
                {currentUser ? (
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}
                  >
                    <Avatar size={'sm'} src={currentUser.photoURL} />
                  </MenuButton>
                ) : (
                  <Button colorScheme={'linkedin'} onClick={login}>
                    Log in
                  </Button>
                )}
                <MenuList>
                  <NextLink href={`/users/${currentUser?.uid}`}>
                    <MenuItem>Account</MenuItem>
                  </NextLink>
                  <MenuDivider />
                  <MenuItem onClick={logout}>Log out</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link.href}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
