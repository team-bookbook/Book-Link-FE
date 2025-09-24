import type { HeaderProps } from '@layouts/header';

type PresetKey = 'HOME' | 'LIBRARY_LIST' | 'LIBRARY_BOOKS' | 'SETTING';

export function headerPreset(key: PresetKey): Partial<HeaderProps> {
  switch (key) {
    case 'HOME':
      return { left: 'logo', title: '홈', actions: ['bell'], notificationCount: 3, searchMode: false };
    case 'LIBRARY_LIST':
      return {
        left: 'back',
        title: undefined,
        searchMode: true,
        searchPlaceholder: '도서관명/지역으로 검색',
        actions: ['kebab'],
      };
    case 'LIBRARY_BOOKS':
      return {
        left: 'back',
        title: undefined,
        searchMode: true,
        searchPlaceholder: '도서명/저자로 검색',
        actions: ['kebab'],
      };
    case 'SETTING':
      return { left: 'back', title: '설정', actions: ['kebab'] };
    default:
      return {};
  }
}
