'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { importNote } from '@/actions';
import { useFormStatus } from 'react-dom';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending}>{pending ? 'Submitting' : 'Submit'}</button>
  );
}

export default function SidebarImportSA() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  // const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const fileInput = e.target;

  //   if (!fileInput.files || fileInput.files.length === 0) {
  //     console.warn('files list is empty');
  //     return;
  //   }

  //   const file = fileInput.files[0];

  //   const formData = new FormData();
  //   formData.append('file', file);

  //   try {
  //     const data = await importNote(formData);
  //     router.push(`/note/${data.uid}`);
  //   } catch (error) {
  //     console.error('something went wrong');
  //   }

  //   // 重置 file input
  //   e.target.type = 'text';
  //   e.target.type = 'file';
  // };

  async function upload(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) {
      console.warn('files list is empty');
      return;
    }

    try {
      const data = await importNote(formData);
      router.push(`/note/${data.uid}`);
    } catch (error) {
      console.error('something went wrong');
    }

    // 重置 file input
    formRef.current?.reset();
  }

  return (
    <form style={{ textAlign: 'center', marginBottom: 20 }} action={upload} ref={formRef}>
      <label
        htmlFor='file'
        style={{ cursor: 'pointer', background: 'cyan', padding: 10 }}
      >
        Import .md File (SA)
      </label>
      <input
        type='file'
        id='file'
        name='file'
        style={{ position: 'absolute', clip: 'rect(0 0 0 0)' }}
        accept='.md'
      />
    </form>
  );
}
