import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { locales, defaultLocale } from 'config';
import { NextResponse, type NextRequest } from 'next/server';

const publicFile = /\.(.*)$/;
const excludeFile = ['logo.svg'];

function getLocale(request: NextRequest, pathnameLocale?: string) {
  if (pathnameLocale) return pathnameLocale;
  const headers = {
    'accept-language': request.headers.get('accept-language') || '',
  };
  const languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // If the pathname already has a locale, do nothing
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) return;

  // If the pathname is a public file, do nothing
  if (
    publicFile.test(pathname) &&
    excludeFile.indexOf(pathname.substring(1)) === -1
  ) {
    return;
  }

  const locale = getLocale(request, pathnameLocale);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  if (locale === defaultLocale) {
    return NextResponse.rewrite(request.nextUrl)
  }

  // Redirect to the URL with the locale
  return Response.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
