import { useTranslations } from 'next-intl';

// app/page.js
export default function Page() {
  const t = useTranslations('Basic');
  return (
    <div className='note--empty-state'>
      <span className='note-text--empty-state'>
        {t('initText')}
      </span>
    </div>
  );
}
