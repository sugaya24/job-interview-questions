import {
  randCatchPhrase,
  randLine,
  randNumber,
  randProgrammingLanguage,
  randUser,
  randUuid,
} from '@ngneat/falso';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

import { Question as TQuestion, User as TUser } from '../common';
import Question from '../models/Question';
import User from '../models/User';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const dummyUsers: TUser[] = [];
for (let i = 0; i < 10; i++) {
  const user = randUser();
  dummyUsers.push({
    uid: user.id,
    username: user.username,
    email: user.email,
    photoURL: user.img + `?u=${user.id}`,
    github: '',
    twitter: '',
    bookmarks: [],
  });
}
const dummyData: TQuestion[] = [];
for (let i = 0; i < 100; i++) {
  const user = dummyUsers[Math.floor(Math.random() * 9)];
  const tags = [];
  for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
    tags.push(randProgrammingLanguage().toLowerCase().split(' ').join(''));
  }
  const likes: string[] = [];
  for (let i = 0; i < 10; i++) {
    if (randNumber({ min: 0, max: 1 })) {
      likes.push(user.uid!);
    }
  }
  dummyData.push({
    author: {
      avatar: user.photoURL!,
      name: user.username!,
      uid: user.uid!,
    },
    comments: [],
    content: `<p>${randLine()}</p>`,
    likes: likes,
    questionId: randUuid(),
    tags: tags,
    title: randCatchPhrase(),
    editorState:
      '{"_nodeMap":[["root",{"__children":["1"],"__dir":null,"__format":0,"__indent":0,"__key":"root","__parent":null,"__type":"root"}],["1",{"__type":"paragraph","__parent":"root","__key":"1","__children":[],"__format":0,"__indent":0,"__dir":null}]],"_selection":{"anchor":{"key":"1","offset":0,"type":"element"},"focus":{"key":"1","offset":0,"type":"element"},"type":"range"}}',
  });
}

const runSeed = async () => {
  await mongoose.connect(process.env.MONGODB_URI!, {});

  try {
    await User.deleteMany();
    await User.insertMany(dummyUsers);
  } catch {
    process.exit(1);
  }

  try {
    await Question.deleteMany();
    await Question.insertMany(dummyData);
  } catch {
    process.exit(1);
  }

  console.log('seeding done!');
  mongoose.connection.close();
};

runSeed();
