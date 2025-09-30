import Icon from '@components/icon';

export default function CardLibraryBook() {
  return (
    <div className='flex-items-center min-h-[13.8rem] w-full gap-[1rem] rounded-[1rem] bg-gray-50 px-[1.4rem]'>
      <div className='min-h-[10rem] min-w-[10rem] bg-green-50'></div>
      <div className='flex-col gap-[2.2rem]'>
        <div className='flex-col gap-[0.2rem]'>
          <h1 className='title6'>IQ84</h1>
          <div className='flex gap-[1rem]'>
            <h2 className='caption5'>무라카미 하루키</h2>
            <span className='flex'>
              <Icon name='cat' size={1.6} className='text-primary-700' />
              <h2 className='caption5'>OO 도서관</h2>
            </span>
          </div>
        </div>
        <div className='flex-col gap-[0.3rem]'>
          <p className='flex-row-center caption5 max-w-[7.4rem] rounded-[0.2rem] bg-gray-100 text-gray-600'>
            2025.09.21
          </p>
          <h3 className='caption5 text-gray-600'>최대 반납기한 30일 | 보증금 500p</h3>
        </div>
      </div>
    </div>
  );
}
