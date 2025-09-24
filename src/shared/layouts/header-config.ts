import type { HeaderProps } from '@layouts/header';
import { matchPath } from 'react-router-dom';
import { ROUTES } from '@routes/routes-config';

type Rule = (path: string, search: string) => HeaderProps | undefined;

const homeRule: Rule = (path) =>
  matchPath({ path: ROUTES.HOME, end: true }, path)
    ? { left: 'logo', title: '홈', actions: ['bell'], notificationCount: 0, searchMode: false, safeTop: true }
    : undefined;

const libraryRootRule: Rule = (path) => {
  if (!matchPath({ path: ROUTES.LIBRARY, end: true }, path)) return undefined;
  const placeholder = '도서관명/도서명으로 검색';
  return {
    left: 'back',
    title: undefined,
    searchMode: true,
    searchPlaceholder: placeholder,
    actions: ['kebab'],
    safeTop: true,
  };
};

const libraryDetailRule: Rule = (path) =>
  matchPath(`${ROUTES.LIBRARY}/:id`, path)
    ? { left: 'back', title: '도서관 상세', actions: ['share', 'bell'], notificationCount: 0, safeTop: true }
    : undefined;

const settingRule: Rule = (path) =>
  matchPath({ path: ROUTES.SETTING, end: true }, path)
    ? { left: 'back', title: '설정', actions: ['kebab'], safeTop: true }
    : undefined;

const fallbackRule = (): HeaderProps => ({
  left: 'back',
  title: 'BookLink',
  actions: ['bell'],
  notificationCount: 0,
  safeTop: true,
});

const RULES: ReadonlyArray<Rule> = [homeRule, libraryRootRule, libraryDetailRule, settingRule];

export function getHeaderForRoute(pathname: string, search: string): HeaderProps {
  for (const rule of RULES) {
    const hit = rule(pathname, search);
    if (hit) return hit;
  }
  return fallbackRule();
}
