import LibraryTab, { type LibraryTabKey } from '@pages/library/components/library-tab';
import { useQueryTab } from '@hooks/use-query-tab';
// import { toast } from '@libs/toast';
// import { modal } from '@libs/modal';
// import Button from '@components/button/button';

// import { TOAST_MESSAGE } from '@constants/toast-messages';
// import { MODAL_TITLE } from '@constants/modal-presets';
import LibraryList from '@pages/library/components/section/section-librarylist';
import BookList from '@pages/library/components/section/section-booklist';

export default function LibraryPage() {
  const [tab, setTab] = useQueryTab<LibraryTabKey>('tab', 'books', ['books', 'libraries']);

  // const onLogoutConfirm = async () => {
  //   const res = await modal.confirm({
  //     title: MODAL_TITLE.LOGOUT,
  //     confirmVariant: 'danger',
  //   });
  //   if (res.ok) toast.success('로그아웃되었습니다.');
  // };

  // const onCartReplace = async () => {
  //   const res = await modal.confirm({
  //     title: MODAL_TITLE.CART_REPLACE,
  //     confirmVariant: 'danger',
  //   });
  //   if (res.ok) toast.info('기존 도서를 비우고 담았어요.');
  // };

  // const onPasswordPrompt = async () => {
  //   const res = await modal.prompt({
  //     title: MODAL_TITLE.PASSWORD_PROMPT,
  //     placeholder: '비밀번호',
  //     password: true,
  //     confirmVariant: 'primary',
  //     maxLength: 32,
  //   });
  //   if (res.ok) toast.success('인증되었습니다.');
  //   else toast.error('인증이 취소되었습니다.');
  // };

  return (
    <>
      <LibraryTab value={tab} onChange={setTab} />
      {tab === 'libraries' ? <LibraryList /> : <BookList />}

      {/* <div className='mt-[2rem] flex flex-col gap-[1rem]'>
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
      </div> */}
    </>
  );
}
