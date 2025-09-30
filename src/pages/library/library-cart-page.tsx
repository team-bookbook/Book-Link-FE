import EmptyState from '@components/empty/empty-state';

export default function CartPage() {
  return (
    <div className='flex-row-center h-[calc(100vh-140px)]'>
      <EmptyState kind='cart' />
    </div>
  );
}
