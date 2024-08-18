'use client';

import SidebarNoteItemContent from '@/components/SidebarNoteItemContent';
import { Note } from '@/lib/db';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export function SidebarNoteListFilter({
  notes,
}: {
  notes: { noteId: string; note: Note; header: JSX.Element }[];
}) {
  const searchParams = useSearchParams();
  const searchText = searchParams.get('q');

  return (
    <ul className='notes-list'>
      {notes.map((item) => {
        const { noteId, note } = item;
        if (
          !searchText ||
          (searchText &&
            note.title.toLowerCase().includes(searchText.toLowerCase()))
        ) {
          return (
            <li key={noteId}>
              <SidebarNoteItemContent
                id={noteId}
                title={note.title}
                expandedChildren={
                  <p className='sidebar-note-excerpt'>
                    {note.content.substring(0, 20) || <i>(No content)</i>}
                  </p>
                }
              >
                {item.header}
              </SidebarNoteItemContent>
            </li>
          );
        }
        return null;
      })}
    </ul>
  );
}

export default function SidebarNoteListFilterWrap({
  notes,
}: {
  notes: { noteId: string; note: Note; header: JSX.Element }[];
}) {
  return (
    <Suspense fallback={null}>
      <SidebarNoteListFilter notes={notes} />
    </Suspense>
  );
}
