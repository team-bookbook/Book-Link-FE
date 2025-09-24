import UnderlineTab from '@components/tab/underline-tab';

export type LibraryTabKey = 'books' | 'libraries';

const TAB_ITEMS = [
  { key: 'books', label: '도서' },
  { key: 'libraries', label: '도서관' },
] as const;

export default function LibraryTab({
  value,
  onChange,
}: {
  value: LibraryTabKey;
  onChange: (next: LibraryTabKey) => void;
}) {
  return (
    <UnderlineTab
      items={TAB_ITEMS as unknown as { key: string; label: string }[]}
      value={value}
      onChange={(k) => onChange(k as LibraryTabKey)}
    />
  );
}
