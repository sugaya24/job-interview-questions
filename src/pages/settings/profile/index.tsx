import { User } from '@/common';
import { Container } from '@/components/Container';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthContext } from '@/contexts';
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  Spacer,
  Spinner,
  Stack,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import React, { ReactElement, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FaGithub, FaTwitter } from 'react-icons/fa';

const editProfile = () => {
  const { currentUser, setCurrentUser, isLoading } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<User>({ mode: 'all' });
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  if (isLoading) {
    return (
      <Container flexGrow={1} mx={4}>
        <Flex
          w={{ base: '100%', md: 'container.md', lg: 'container.lg' }}
          my={8}
          py={8}
          px={8}
          flexGrow={1}
          flexDir={'column'}
          bgColor={'white'}
          border={'1px'}
          borderColor={'blackAlpha.400'}
          borderRadius={'2xl'}
        >
          <Center h={'100%'}>
            <Spinner />
          </Center>
        </Flex>
      </Container>
    );
  }

  const onChangeHandler = (e: { target: { name: string; value: string } }) => {
    const name = e.target.name;
    const value = e.target.value;
    setCurrentUser({ ...currentUser!, [name]: value });
  };

  const uploadPicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target) return;
    const file: File = e.target.files?.[0]!;
    const filename = encodeURIComponent(currentUser?.uid!);
    const extension = encodeURIComponent(
      file.name.split('.').pop() ? file.name.split('.').pop()! : false,
    );
    const formData = new FormData();
    const params = { filename, extension };
    const query = new URLSearchParams(params);
    const res = await fetch(`/api/s3/uploadFile?${query}`);
    const { url, fields } = await res.json();
    Object.entries({ ...fields, file }).forEach(([key, value]: any) =>
      formData.append(key, value),
    );
    const upload = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    console.log(upload.ok ? 'updated successfully' : 'upload failed');

    if (!upload.ok) return;

    // update user data on db for photoURL
    const s3ObjectUrl = await fetch(
      `/api/s3/getObjectUrl?key=${currentUser?.uid}.${extension}`,
    )
      .then((res) => res.json())
      .then((data) => data.s3ObjectUrl);
    await fetch(`/api/users/${currentUser?.uid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...currentUser, photoURL: s3ObjectUrl }),
    });

    // set photoURL on currentUser
    const resGetImage = await fetch(
      `/api/s3/getObjectUrl?key=${currentUser?.uid}.${extension}`,
    );
    const dataGetImage = await resGetImage.json();
    setCurrentUser({
      ...currentUser!,
      photoURL: dataGetImage?.s3ObjectUrl + `?${Date.now()}`,
    });
  };

  async function onSubmit(values: User) {
    const res = await fetch(`/api/users/${currentUser?.uid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (data.success) {
      const res = await fetch(`/api/users/${currentUser?.uid}`);
      const data = await res.json();
      setCurrentUser(data.user);
      toast({
        title: 'Profile has been successfully updated',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Something went wrong...',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }

  return (
    <Container flexGrow={1} mx={4}>
      <Flex
        w={{ base: '100%', md: 'container.md', lg: 'container.lg' }}
        my={8}
        py={8}
        px={8}
        flexGrow={1}
        flexDir={'column'}
        bgColor={'white'}
        border={'1px'}
        borderColor={'blackAlpha.400'}
        borderRadius={'2xl'}
      >
        <Flex
          h={'100%'}
          as={'form'}
          flexDir={'column'}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack direction={{ base: 'column', md: 'row' }} gap={8}>
            <VStack>
              <Avatar
                size={'xl'}
                src={(currentUser && currentUser.photoURL) || ''}
              />
              <Input
                type={'file'}
                ref={inputRef}
                hidden
                accept={'image/*'}
                onChange={uploadPicture}
              />
              <Button
                variant={'ghost'}
                size={'sm'}
                onClick={() => {
                  inputRef.current?.click();
                }}
              >
                Change picture
              </Button>
            </VStack>
            <Box w={'100%'}>
              <FormControl isInvalid={!!errors.username}>
                <FormLabel>Username</FormLabel>
                <Input
                  bgColor={'gray.100'}
                  placeholder={'Enter Username'}
                  value={currentUser?.username!}
                  {...register('username', {
                    required: {
                      value: true,
                      message: 'Username is required',
                    },
                    maxLength: {
                      value: 20,
                      message: 'Maximum length should be 20',
                    },
                  })}
                  onChange={onChangeHandler}
                />
                <FormErrorMessage>
                  {errors.username && errors.username.message}
                </FormErrorMessage>
              </FormControl>
              <Grid templateColumns={'1fr 1fr'} gap={4}>
                <GridItem>
                  <FormControl isInvalid={!!errors.github}>
                    <FormLabel mt={8}>
                      <HStack>
                        <FaGithub />
                        <Text>Github</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      bgColor={'gray.100'}
                      placeholder={'username'}
                      value={currentUser?.github!}
                      {...register('github', {
                        validate: (value) => {
                          if (!value) return true;
                          return value.match(
                            /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i,
                          )
                            ? true
                            : 'Invalid GitHub username';
                        },
                      })}
                      onChange={onChangeHandler}
                    />
                    <FormErrorMessage>
                      {errors.github && errors.github.message}
                    </FormErrorMessage>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isInvalid={!!errors.twitter}>
                    <FormLabel mt={8}>
                      <HStack>
                        <FaTwitter />
                        <Text>Twitter</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      bgColor={'gray.100'}
                      placeholder={'username'}
                      value={currentUser?.twitter!}
                      {...register('twitter', {
                        validate: (value) => {
                          if (!value) return true;
                          return value.match(/^[A-Za-z0-9_]{1,15}$/)
                            ? true
                            : 'Invalid Twitter username';
                        },
                      })}
                      onChange={onChangeHandler}
                    />
                    <FormErrorMessage>
                      {errors.twitter && errors.twitter.message}
                    </FormErrorMessage>
                  </FormControl>
                </GridItem>
              </Grid>
            </Box>
          </Stack>

          <Spacer />

          <Flex flexDir={'column'}>
            <Divider my={8} />
            <Center>
              <Button
                colorScheme={'linkedin'}
                type={'submit'}
                isLoading={isSubmitting}
              >
                Save
              </Button>
            </Center>
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
};

export default editProfile;

editProfile.getLayout = function getLayout(page: ReactElement) {
  return (
    <ProtectedRoute>
      <Layout>{page}</Layout>
    </ProtectedRoute>
  );
};
