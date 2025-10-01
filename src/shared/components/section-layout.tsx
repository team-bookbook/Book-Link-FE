import type { ReactNode } from 'react';

interface SectionLayoutProps {
  title: string;
  linkText?: string;
  onLinkClick?: () => void;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyText?: string;
  loadingText?: string;
  children: ReactNode;
}

export default function SectionLayout({
  title,
  linkText = '전체 보기 →',
  onLinkClick,
  isLoading = false,
  isEmpty = false,
  emptyText = '데이터가 없습니다',
  loadingText = '데이터를 불러오는 중...',
  children,
}: SectionLayoutProps) {
  return (
    <section className='flex-col gap-[1.5rem]'>
      <div className='flex justify-between px-[2rem]'>
        <h1 className='title5 ml-[0.5rem] text-gray-700'>{title}</h1>
        <a className='caption5 mt-[0.4rem] cursor-pointer text-gray-400' onClick={onLinkClick}>
          {linkText}
        </a>
      </div>
      {isLoading ? (
        <div className='px-[2rem] text-center text-gray-500'>{loadingText}</div>
      ) : isEmpty ? (
        <div className='px-[2rem] text-center text-gray-500'>{emptyText}</div>
      ) : (
        children
      )}
    </section>
  );
}
