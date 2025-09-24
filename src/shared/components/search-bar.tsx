import { forwardRef } from 'react';
import Icon from '@components/icon';
import { cn } from '@libs/cn';

export type SearchBarProps = {
  placeholder?: string;
  name?: string;
  defaultValue?: string;
  onSubmit?: (value: string) => void;
  className?: string;
};

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ placeholder = '도서/도서관명으로 검색', name = 'q', defaultValue, onSubmit, className }, ref) => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const v = String(new FormData(e.currentTarget).get(name) ?? '');
          onSubmit?.(v);
        }}
        className={cn(
          'flex-row-between w-full',
          'bg-gray-white rounded-[8px] border-[0.1rem] border-gray-200',
          'px-[1.6rem] py-[1.3rem]',
          className
        )}
      >
        <input
          ref={ref}
          name={name}
          defaultValue={defaultValue}
          inputMode='search'
          placeholder={placeholder}
          className={cn('flex-1 bg-transparent outline-none', 'body5', 'placeholder:text-gray-400')}
        />
        <Icon name='search' className='text-gray-900' size={2.2} ariaHidden />
      </form>
    );
  }
);

SearchBar.displayName = 'SearchBar';
export default SearchBar;
