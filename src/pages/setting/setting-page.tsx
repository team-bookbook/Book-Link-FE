import Icon from '@components/icon';

export default function SettingPage() {
  return (
    <div className='bg-gray-50 text-gray-900'>
      <div className='mx-auto w-full flex-col gap-[1rem] pb-[3rem]'>
        <section className='bg-gray-white rounded-b-[16px] px-[2rem] py-[2.4rem]'>
          <div className='flex items-center gap-[1.2rem]'>
            <Icon name='cat-profile' size={6} className='text-gray-200' ariaHidden />
            <div className='min-w-0 flex-1'>
              <p className='title5'>북북</p>
              <button type='button' className='flex cursor-pointer items-center gap-[0.4rem] text-gray-500'>
                <span className='caption3'>내 정보 수정</span>
                <Icon name='dropdown' rotate={270} size={1.6} className='text-gray-400' ariaHidden />
              </button>
            </div>
          </div>
        </section>

        <section className='bg-gray-white overflow-hidden rounded-[16px] py-[1rem]'>
          <ListItem icon='point' label='포인트 내역 조회' withDivider />
          <ListItem icon='my-docs' label='개인정보 처리방침' withDivider />
          <ListItem icon='my-docs' label='이용약관' />
        </section>

        <section className='bg-gray-white overflow-hidden rounded-[16px]'>
          <ListItem icon='my-comment' label='북북 팀에게 문의하기' />
        </section>
      </div>
    </div>
  );
}

type ItemProps = {
  icon: string;
  label: string;
  withDivider?: boolean;
};

function ListItem({ icon, label, withDivider }: ItemProps) {
  return (
    <>
      <div className='flex cursor-pointer items-center justify-between px-[2rem] py-[2rem]'>
        <div className='flex items-center gap-[0.6rem] text-gray-900'>
          <Icon name={icon} size={2.0} ariaHidden />
          <span className='title6'>{label}</span>
        </div>
        <Icon name='arrow' rotate={180} size={1.6} className='text-gray-900' ariaHidden />
      </div>

      {withDivider && <div aria-hidden className='mx-[2rem] h-[0.1rem] bg-gray-100' />}
    </>
  );
}
