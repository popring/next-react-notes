import React, { Suspense } from 'react';
import Link from 'next/link';
import SidebarNoteList from '@/components/SidebarNoteList';
import EditButton from '@/components/EditButton';
import NoteListSkeleton from './NoteListSkeleton';
import SidebarSearchField from './SidebarSearchField';
import { useTranslations } from 'next-intl';

export default async function Sidebar() {
  const t = useTranslations('Basic');
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
        <section className='sidebar-menu' role='menubar'>
          <SidebarSearchField search={t('search')} />
          <EditButton noteId={null}>{t('new')}</EditButton>
        </section>
        <Suspense fallback={<NoteListSkeleton />}>
          <SidebarNoteList />
        </Suspense>
      </section>
    </>
  );
}
