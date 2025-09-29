import Icon from '@components/icon';

type Msg =
  | { id: string; kind: 'system'; text: string }
  | { id: string; kind: 'date'; text: string }
  | { id: string; kind: 'mine'; text: string; time: string }
  | { id: string; kind: 'other'; text: string; time: string };

const MESSAGES: Msg[] = [
  { id: 's1', kind: 'system', text: '사용자 님이 입장하셨습니다.' },
  { id: 'd1', kind: 'date', text: '2025년 9월 21일 일요일' },
  { id: 'm1', kind: 'mine', text: '안녕하세요!', time: '오후 1:34' },
  { id: 'm2', kind: 'mine', text: '혹시 ~~~~', time: '오후 1:34' },
  {
    id: 'o1',
    kind: 'other',
    text: `안녕하세요~\nㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ\nㅇㅇㅇㅇㅇㅇㅇㅇㅇ`,
    time: '오후 1:38',
  },
];

const ChatDetailPage = () => {
  return (
    <div className='flex-col-between bg-gray-25 min-h-dvh text-gray-900'>
      <section className='bg-secondary-100 sticky top-0 w-full'>
        <div className='mx-auto w-full max-w-[43rem] px-[2rem] py-[1.2rem]'>
          <div className='flex items-center gap-[1.2rem]'>
            <div className='h-[4.8rem] w-[4.8rem] shrink-0 rounded-[8px] bg-gray-200' />
            <div className='min-w-0 flex-1'>
              <p className='title6 text-secondary-900 truncate'>노르웨이의 숲 외 2권</p>
              <p className='caption2 text-gray-600'>반납기한 2025-09-30까지</p>
            </div>
            <button
              type='button'
              className='flex-row-center gap-[0.6rem] rounded-[8px] bg-gray-100 px-[1.2rem] py-[0.8rem] text-gray-800'
            >
              <Icon name='dropdown' size={1.4} ariaHidden />
              <span className='caption2'>대여 대기</span>
            </button>
          </div>
        </div>
      </section>

      <div
        id='content'
        className='scrollbar-hide mx-auto flex w-full max-w-[43rem] flex-1 flex-col gap-[1.2rem] overflow-y-auto px-[2rem] py-[1.6rem]'
      >
        {MESSAGES.map((m) => {
          if (m.kind === 'system' || m.kind === 'date') {
            return (
              <div key={m.id} className='flex w-full justify-center'>
                <span className='caption2 rounded-full bg-gray-100 px-[1.2rem] py-[0.8rem] text-gray-700'>
                  {m.text}
                </span>
              </div>
            );
          }

          if (m.kind === 'mine') {
            return (
              <div key={m.id} className='flex flex-col items-end gap-[0.4rem]'>
                <div className='bg-secondary-900 text-gray-white body5 max-w-[80%] rounded-[18px] rounded-br-[6px] px-[1.4rem] py-[1.0rem] whitespace-pre-wrap'>
                  {m.text}
                </div>
                <span className='caption3 text-gray-500'>{m.time}</span>
              </div>
            );
          }

          return (
            <div key={m.id} className='flex items-end gap-[0.8rem]'>
              <div className='grid h-[3.6rem] w-[3.6rem] place-items-center rounded-full border border-gray-200 text-gray-500'>
                <Icon name='cat-profile' size={2.0} ariaHidden />
              </div>
              <div className='flex flex-col gap-[0.4rem]'>
                <div className='bg-gray-white body5 max-w-[70vw] rounded-[18px] rounded-bl-[6px] px-[1.4rem] py-[1.0rem] whitespace-pre-wrap shadow-sm'>
                  {m.text}
                </div>
                <span className='caption3 text-right text-gray-500'>{m.time}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className='fixed bottom-0 mx-auto w-full max-w-[43rem] px-[2rem] py-[1.2rem]'>
        <div className='bg-gray-white flex items-center gap-[0.8rem] rounded-full px-[1.2rem] py-[0.8rem] shadow-md'>
          <button type='button' aria-label='첨부' className='p-[0.4rem] text-gray-700 active:opacity-70'>
            <Icon name='plus' size={2.0} ariaHidden />
          </button>
          <input
            className='body5 h-[3.2rem] flex-1 bg-transparent outline-none placeholder:text-gray-500'
            placeholder='메세지를 입력해주세요.'
          />
          <button
            type='button'
            aria-label='전송'
            className='bg-etc-sky text-gray-white grid h-[3.6rem] w-[3.6rem] place-items-center rounded-full active:opacity-80'
          >
            <Icon name='send' size={1.8} ariaHidden />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetailPage;
