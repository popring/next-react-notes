'use server';
import { updateNote, addNote, delNote, Note } from '@/lib/redis';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

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
