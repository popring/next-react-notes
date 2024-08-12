'use server';
import { updateNote, addNote, delNote, Note } from '@/lib/redis';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { stat, mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import dayjs from 'dayjs';

const scheme = z.object({
  title: z.string(),
  content: z.string().min(1, '请填写内容').max(100, '字数最多 100'),
  noteId: z.string().optional(),
});

export type SaveNoteResult = {
  msg: string;
  errors: string | null;
};

export interface FormData {
  get: (name: string) => FormDataEntryValue | null;
}

export async function saveNote(prevState: SaveNoteResult, formData: FormData) {
  const noteId = formData.get('noteId') as string | null;
  const data: Note = {
    title: formData.get('title') as string,
    content: formData.get('body') as string,
    updateTime: new Date().toString(),
  };

  const validated = scheme.safeParse(data);
  if (!validated.success) {
    return {
      msg: 'Validation Error',
      errors: validated.error.issues.map(item => item.message).join(','),
    };
  }
  if (noteId) {
    await updateNote(noteId, data);
    revalidatePath('/', 'layout');
    // redirect(`/note/${noteId}`);
    return { msg: 'Add Success!', errors: null };
  } else {
    const id = await addNote(data);
    revalidatePath('/', 'layout');
    // redirect(`/note/${id}`);

    return { msg: 'Add Success!', errors: null };
  }
}

export async function deleteNote(
  prevState: SaveNoteResult,
  formData: FormData
) {
  const noteId = formData.get('noteId') as string;
  await delNote(noteId);
  revalidatePath('/', 'layout');
  // redirect('/');
  return { msg: 'Delete Success!', errors: null };
}

export async function importNote(formData: FormData) {
  const file = formData.get('file') as File;

  // 空值判断
  if (!file) {
    return { error: 'File is required.' };
  }

  // 写入文件
  const buffer = Buffer.from(await file.arrayBuffer());
  const relativeUploadDir = `/uploads/${dayjs().format('YY-MM-DD')}`;
  const uploadDir = join(process.cwd(), 'public', relativeUploadDir);

  try {
    await stat(uploadDir);
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      await mkdir(uploadDir, { recursive: true });
    } else {
      console.error(e);
      return { error: 'Something went wrong.' };
    }
  }

  try {
    // 写入文件
    const uniqueSuffix = `${Math.random().toString(36).slice(-6)}`;
    const filename = file.name.replace(/\.[^/.]+$/, '');
    const uniqueFilename = `${filename}-${uniqueSuffix}.${file.name.split('.').pop()}`;
    await writeFile(`${uploadDir}/${uniqueFilename}`, buffer);

    // 调用接口，写入数据库
    const res = await addNote(
      JSON.stringify({
        title: filename,
        content: buffer.toString('utf-8'),
      })
    );

    // 清除缓存
    revalidatePath('/', 'layout');

    return { fileUrl: `${relativeUploadDir}/${uniqueFilename}`, uid: res };
  } catch (e) {
    console.error(e);
    return { error: 'Something went wrong.' };
  }
}