import React, { Suspense } from 'react';
import Link from 'next/link';
import SidebarNoteList from '@/components/SidebarNoteList';
import EditButton from '@/components/EditButton';
import NoteListSkeleton from './NoteListSkeleton';
import SidebarSearchField from './SidebarSearchField';
import SidebarImport from './SidebarImport';
import SidebarImportSA from './SidebarImportSA';

export default async function Sidebar() {
  return (
    <>
      <section className='col sidebar'>
        <Link href={'/'} className='link--unstyled'>
          <section className='sidebar-header'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className='logo'
              src='/logo.svg'
              width='22px'
              height='20px'
              alt=''
              role='presentation'
            />
            <strong>React Notes</strong>
          </section>
        </Link>
        <SidebarImport />
        <SidebarImportSA />
        <section className='sidebar-menu' role='menubar'>
          <SidebarSearchField />
          <EditButton noteId={null}>New</EditButton>
        </section>
        <Suspense fallback={<NoteListSkeleton />}>
          <SidebarNoteList />
        </Suspense>
      </section>
    </>
  );
}
