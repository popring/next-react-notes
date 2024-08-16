import SidebarNoteListFilter from '@/components/SidebarNoteListFilter';
import { getAllNotes } from '@/lib/db';
import { sleep } from '@/lib/utils';
import SidebarNoteItemHeader from '@/components/SidebarNoteItemHeader';

export default async function NoteList() {
  await sleep(0);
  const notes = await getAllNotes();
  const notesData = Object.entries(notes)

  if (notesData.length == 0) {
    return <div className='notes-empty'>{'No notes created yet!'}</div>;
  }

  return (
    <SidebarNoteListFilter
      notes={notesData.map(item => ({
        noteId: item[0],
        note: item[1],
        header: <SidebarNoteItemHeader title={item[1].title} updateTime={item[1].updateTime} />,
      }))}
    />
  );
}
