import Icon from '@components/icon';

export default function NotificationCard() {
  return (
    <div className='flex items-start gap-[0.6rem] rounded-[10px] bg-white p-[2rem]'>
      <Icon name='notification-book' size={1.9} ariaHidden className='mt-[0.1rem] text-gray-900' />
      <div className='w-full flex-col gap-[0.6rem]'>
        <div className='flex-row-between'>
          <h3 className='caption5 text-gray-500'>커뮤니티</h3>
          <h3 className='caption5 text-gray-500'>방금 전</h3>
        </div>
        <h2 className='body5 line-clamp-2 cursor-pointer text-gray-900'>
          [이번 달에 책 10권 읽었어요] 글에 댓글이 달렸습니다! 글이 달렸습니다! 글이 달렸습니다!글이 달렸습니다!글이
          달렸습니다!
        </h2>
        <h2 className='caption5 text-gray-900'>2025.09.22(일) 오후 07:42</h2>
      </div>
    </div>
  );
}
