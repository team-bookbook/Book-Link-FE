import { useState } from 'react';
import LibraryTab, { type LibraryTabKey } from '@pages/library/components/library-tab';
import { useQueryTab } from '@hooks/use-query-tab';
import SelectDropdown from '@components/dropdown/select-dropdown';
import { toast } from '@libs/toast';
import { modal } from '@libs/modal';
import Button from '@components/button/button';

import {
  LIB_SORT_OPTIONS,
  BOOK_SORT_OPTIONS,
  RENT_STATUS_OPTIONS,
  type LibSort,
  type BookSort,
  type RentStatus,
} from '@components/dropdown/constants/select-options';

import { TOAST_MESSAGE } from '@constants/toast-messages';
import { MODAL_TITLE } from '@constants/modal-presets';

export default function LibraryPage() {
  const [tab, setTab] = useQueryTab<LibraryTabKey>('tab', 'books', ['books', 'libraries']);

  const onLogoutConfirm = async () => {
    const res = await modal.confirm({
      title: MODAL_TITLE.LOGOUT,
      confirmVariant: 'danger',
    });
    if (res.ok) toast.success('로그아웃되었습니다.');
  };

  const onCartReplace = async () => {
    const res = await modal.confirm({
      title: MODAL_TITLE.CART_REPLACE,
      confirmVariant: 'danger',
    });
    if (res.ok) toast.info('기존 도서를 비우고 담았어요.');
  };

  const onPasswordPrompt = async () => {
    const res = await modal.prompt({
      title: MODAL_TITLE.PASSWORD_PROMPT,
      placeholder: '비밀번호',
      password: true,
      confirmVariant: 'primary',
      maxLength: 32,
    });
    if (res.ok) toast.success('인증되었습니다.');
    else toast.error('인증이 취소되었습니다.');
  };

  return (
    <>
      <LibraryTab value={tab} onChange={setTab} />
      {tab === 'libraries' ? <LibraryList /> : <BookList />}

      <div className='mt-[2rem] flex flex-col gap-[1rem]'>
        <div className='flex items-center gap-[0.8rem]'>
          <Button type='button' variant='outline' onClick={() => toast.info(TOAST_MESSAGE.EMAIL_CHECK)}>
            Toast Info
          </Button>
          <Button type='button' variant='primary' onClick={() => toast.success(TOAST_MESSAGE.LOGIN_SUCCESS)}>
            Toast Success
          </Button>
          <Button type='button' variant='danger' onClick={() => toast.error(TOAST_MESSAGE.LOGIN_FAIL)}>
            Toast Error
          </Button>
        </div>

        <div className='flex items-center gap-[0.8rem]'>
          <Button type='button' variant='danger' onClick={onLogoutConfirm}>
            모달: 로그아웃 확인
          </Button>
          <Button type='button' variant='danger' onClick={onCartReplace}>
            모달: 장바구니 교체
          </Button>
          <Button type='button' variant='primary' onClick={onPasswordPrompt}>
            모달: 비밀번호 입력
          </Button>
        </div>
      </div>
    </>
  );
}

function LibraryList() {
  const [libSort, setLibSort] = useState<LibSort>('recent');
  const [rentStatus, setRentStatus] = useState<RentStatus>('pending');

  return (
    <div className='flex-col gap-[1.2rem]'>
      <div className='flex-row-between'>
        <div className='flex items-center gap-[1.2rem]'>
          <SelectDropdown
            triggerLabel={libSort === 'recent' ? '최신순' : libSort === 'distance' ? '거리순' : '인기순'}
            value={libSort}
            onChange={setLibSort}
            options={LIB_SORT_OPTIONS}
            variant='title'
            align='start'
          />
        </div>

        <SelectDropdown
          variant='chip'
          value={rentStatus}
          onChange={setRentStatus}
          options={RENT_STATUS_OPTIONS}
          align='end'
          menuWidthRem={12}
        />
      </div>
    </div>
  );
}

function BookList() {
  const [bookSort, setBookSort] = useState<BookSort>('recent');

  return (
    <div className='flex-col gap-[1.2rem]'>
      <div className='flex-row-between'>
        <SelectDropdown
          triggerLabel={bookSort === 'recent' ? '최신순' : '인기순'}
          value={bookSort}
          onChange={setBookSort}
          options={BOOK_SORT_OPTIONS}
          variant='title'
          align='end'
        />
      </div>
    </div>
  );
}
