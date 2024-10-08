'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useTransition } from 'react';

function Spinner({ active = true }) {
  return (
    <div
      className={['spinner', active && 'spinner--active'].join(' ')}
      role='progressbar'
      aria-busy={active ? 'true' : 'false'}
    />
  );
}

export function SidebarSearchField() {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  function getSearchTerm() {
    return searchParams.get('q') || '';
  }

  return (
    <div className='search' role='search'>
      <label className='offscreen' htmlFor='sidebar-search-input'>
        Search for a note by title
      </label>
      <input
        defaultValue={getSearchTerm()}
        id='sidebar-search-input'
        placeholder='Search'
        type='text'
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Spinner active={isPending} />
    </div>
  );
}

export default function SidebarSearchFieldWrap() {
  return (
    <Suspense fallback={null}>
      <SidebarSearchField />
    </Suspense>
  );
}
