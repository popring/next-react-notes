import { PrismaClient } from '@prisma/client';
import { auth } from 'auth';

export const primas = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = primas;
}

export interface Note {
  title: string;
  content: string;
  updateTime: string;
}

export interface NotesHash {
  [key: string]: Note;
}
export async function getAllNotes() {
  const session = await auth();
  if (session === null) return [];

  const notes = await primas.note.findMany({
    where: {
      authorId: session.user?.userId,
    },
  });

  const res: NotesHash = {};
  notes.forEach(({ title, content, id, updatedAt }) => {
    res[id] = {
      title,
      content: content || '',
      updateTime: updatedAt.toISOString(),
    };
  });
  return res;
}

export async function addNote(data: Omit<Note, 'updateTime'>) {
  const session = await auth();
  if (session === null) return '';

  const note = await primas.note.create({
    data: {
      title: data.title,
      content: data.content,
      author: {
        connect: {
          id: session.user.userId,
        },
      },
    },
  });

  return note.id;
}

export async function updateNote(uuid: string, data: Omit<Note, 'updateTime'>) {
  await primas.note.update({
    where: {
      id: uuid,
    },
    data: {
      title: data.title,
      content: data.content,
    },
  });
}

export async function getNote(uuid: string) {
  const session = await auth();
  if (session === null) return {};

  const note = await primas.note.findFirst({
    where: {
      id: uuid,
    },
  });

  if (!note) return {};

  const { title, content, updatedAt, id } = note;
  return {
    id,
    title,
    content: content || '',
    updateTime: updatedAt.toISOString(),
  };
}

export async function delNote(uuid: string) {
  await primas.note.delete({
    where: {
      id: uuid,
    },
  });
}

export async function addUser(username: string, password: string) {
  const res = await primas.user.create({
    data: {
      username,
      password,
      notes: {
        create: [],
      },
    },
  });
  return {
    username,
    name: username,
    userId: res.id,
  };
}

export async function getUser(username: string, password: string) {
  const user = await primas.user.findFirst({
    where: {
      username,
    },
    include: {
      notes: true,
    },
  });

  if (!user) return 0;
  if (user.password !== password) return 1;
  return {
    name: username,
    username,
    userId: user.id,
  };
}

export default primas;
