import { useState } from 'react';
import Button from '@components/button/button';
import useBottomSheet from '@components/bottom-sheet/hooks/use-bottom-sheet';
import SelectBottomSheet from '@components/bottom-sheet/select-bottom-sheet';

export default function ChatPage() {
  const { isOpen, open, close } = useBottomSheet();
  const [category, setCategory] = useState<string | null>('cat-a');

  const categories = [
    { value: 'cat-a', label: '카테고리 A' },
    { value: 'cat-b', label: '카테고리 B' },
    { value: 'cat-c', label: '카테고리 C' },
  ] as const;

  return (
    <>
      <div className='flex items-center gap-[0.8rem]'>
        <Button type='button' variant='outline' onClick={open}>
          카테고리 선택
        </Button>
        <span className='body5 text-gray-700'>
          선택됨: {categories.find((c) => c.value === category)?.label ?? '없음'}
        </span>
      </div>

      <SelectBottomSheet
        open={isOpen}
        onClose={close}
        title='타이틀'
        options={categories}
        value={category}
        onChange={(next) => setCategory(next)}
      />
    </>
  );
}
