'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function toggle() {
    const next = locale === 'en' ? 'vi' : 'en';
    const stripped = pathname.replace(/^\/(en|vi)/, '');
    router.push(`/${next}${stripped || '/'}`);
  }

  return (
    <button onClick={toggle} className="text-sm font-medium text-gray-500 hover:text-primary transition-colors px-2 py-1 rounded border border-gray-200 hover:border-primary">
      {locale === 'en' ? 'VI' : 'EN'}
    </button>
  );
}
