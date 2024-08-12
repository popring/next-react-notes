'use client';

import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react';

export default function SidebarImport() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      console.warn('files list is empty');
      return;
    }

    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        console.error('Error uploading file');
        return;
      }
      const data = await response.json();
      startTransition(() => router.push(`/note/${data.uid}`));
      startTransition(() => router.refresh());
    } catch (error) {
      console.error('Error uploading file', error);
    }
    // 重置 file input
    e.target.type = 'text';
    e.target.type = 'file';
  };

  return (
    <form
      method='post'
      encType='multipart/form-data'
      style={{ marginBottom: 20 }}
    >
      <div style={{ textAlign: 'center' }}>
        <label
          htmlFor='file'
          style={{ cursor: 'pointer', background: 'skyblue', padding: 10 }}
        >
          Import .md File
        </label>
        <input
          type='file'
          id='file'
          name='file'
          multiple
          style={{ position: 'absolute', clip: 'rect(0 0 0 0)' }}
          accept='.md'
          onChange={onChange}
        />
      </div>
    </form>
  );
}
