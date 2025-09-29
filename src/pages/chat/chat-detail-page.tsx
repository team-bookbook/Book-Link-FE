import { useState } from 'react';
import Icon from '@components/icon';
import SelectDropdown from '@components/dropdown/select-dropdown';
import { cn } from '@libs/cn';

type Msg =
  | { id: string; kind: 'system'; text: string }
  | { id: string; kind: 'date'; text: string }
  | { id: string; kind: 'mine'; text: string; time: string }
  | { id: string; kind: 'other'; text: string; time: string };

const MESSAGES: Msg[] = [
  { id: 's1', kind: 'system', text: '사용자 님이 입장하셨습니다.' },
  { id: 'd1', kind: 'date', text: '2025년 9월 21일 일요일' },
  { id: 'm1', kind: 'mine', text: '안녕하세요!', time: '오후 1:34' },
  { id: 'm2', kind: 'mine', text: '혹시 책 대여할 수 있을까요? 정말 꼭 읽고 싶은 책들이라서요!', time: '오후 1:34' },
  {
    id: 'o1',
    kind: 'other',
    text: `안녕하세요 반갑습니다. 당연히 가능합니다! 원하시는 날짜랑 대여 장소, 대여 기간 말씀해 주세요.`,
    time: '오후 1:38',
  },
];

type RentStatus = '대여 대기' | '대여 중' | '반납 완료';

const STATUS_OPTIONS: readonly { value: RentStatus; label: string }[] = [
  { value: '대여 대기', label: '대여 대기' },
  { value: '대여 중', label: '대여 중' },
  { value: '반납 완료', label: '반납 완료' },
] as const;

const ChatDetailPage = () => {
  const [status, setStatus] = useState<RentStatus>('대여 대기');

  return (
    <div className='flex-col-between min-h-dvh bg-gray-50 text-gray-900'>
      <section className='bg-secondary-100 sticky top-0 w-full'>
        <div className='mx-auto w-full px-[2rem] py-[1.2rem]'>
          <div className='flex items-center gap-[1.2rem]'>
            <div className='h-[4rem] w-[4rem] shrink-0 rounded-[8px] bg-gray-200' />
            <div className='flex-1 flex-col gap-[0.3rem]'>
              <p className='caption2 text-primary-900 truncate'>노르웨이의 숲 외 2권</p>
              <p className='caption5 text-gray-600'>반납기한 2025-09-30까지</p>
            </div>
            <SelectDropdown<RentStatus>
              value={status}
              options={STATUS_OPTIONS}
              onChange={setStatus}
              variant='chip'
              align='end'
            />
          </div>
        </div>
      </section>

      <div
        id='content'
        className='scrollbar-hide mx-auto w-full flex-1 flex-col gap-[1.2rem] overflow-y-auto px-[2rem] py-[1.6rem]'
      >
        {MESSAGES.map((m) => {
          if (m.kind === 'system' || m.kind === 'date') {
            return (
              <div key={m.id} className='flex w-full justify-center'>
                <span className='caption5 bg-gray-white rounded-full px-[1.2rem] py-[0.8rem] text-gray-700'>
                  {m.text}
                </span>
              </div>
            );
          }
          if (m.kind === 'mine') {
            return (
              <div key={m.id} className='flex w-full justify-end'>
                <div className='flex max-w-[85%] items-end gap-[0.6rem]'>
                  <span className='caption5 shrink-0 text-gray-400'>{m.time}</span>
                  <div className='bg-primary-700 text-gray-white body5 rounded-[18px] rounded-tr-[0px] px-[1.4rem] py-[1.0rem] whitespace-pre-wrap'>
                    {m.text}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={m.id} className='flex items-end gap-[0.8rem]'>
              <div className='flex h-full items-start gap-[0.8rem]'>
                <Icon name='cat-profile' className='text-gray-300' size={3.6} ariaHidden />
                <div className='flex max-w-[85%] items-end gap-[0.6rem]'>
                  <div className='bg-gray-white body5 rounded-[18px] rounded-tl-[0px] px-[1.4rem] py-[1.0rem] whitespace-pre-wrap'>
                    {m.text}
                  </div>
                </div>
              </div>
              <span className='caption5 shrink-0 text-gray-400'>{m.time}</span>
            </div>
          );
        })}
      </div>

      <div className='fixed bottom-0 mx-auto w-full max-w-[43rem] px-[2rem] py-[1.2rem]'>
        <div className='bg-gray-white flex items-center gap-[0.8rem] rounded-full px-[1.2rem] py-[0.8rem]'>
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
            className={cn(
              'flex-row-center h-[3.2rem] w-[3.2rem] cursor-pointer rounded-full active:opacity-90',
              'bg-secondary-900'
            )}
          >
            <Icon name='send' size={2} className='text-gray-white' ariaHidden />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetailPage;
