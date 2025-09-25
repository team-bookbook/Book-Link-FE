import Faq from '@components/faq/faq';
import { FAQ_ITEMS } from '@components/faq/constants/faq';
import IntroduceBanner from '@components/banner/introduce-banner';
import { INTRODUCE_STEPS } from '@components/banner/constants/introduce';
import HomeBanner from '@components/banner/home-banner';
import Divider from '@components/divider';

export default function HomePage() {
  return (
    <div className='flex-col gap-[3rem] bg-gray-50 py-[2.5rem]'>
      <div className='flex-col gap-[1.2rem] px-[2rem]'>
        <p className='title5 px-[0.6rem]'>
          <span className='text-primary-800'>북북</span>
          <span className='text-gray-600'>님 안녕하세요!</span>
        </p>
        <HomeBanner hasLoan title='모순' dday={1} /> {/* <HomeBanner hasLoan={false} /> */}
      </div>
      <div className='flex-col gap-[1.5rem]'>
        <Divider />
        <div className='flex-col gap-[0.2rem] px-[2rem] py-[1rem]'>
          <h2 className='title4 text-gray-900'>서비스 이용 방법</h2>
          <p className='body5 text-gray-600'>간단한 단계로 도서관을 운영하세요!</p>
        </div>
        <div className='flex-col-center gap-[1.5rem] border-gray-100 px-[2rem]'>
          {INTRODUCE_STEPS.map((s) => (
            <IntroduceBanner key={s.id} id={s.id} title={s.title} stepText={s.stepText} variant={s.variant} />
          ))}
        </div>
        <Divider />
      </div>
      <section className='flex-col gap-[1rem] px-[1.5rem]'>
        <div className='flex-col gap-[0.2rem] px-[0.5rem] py-[1rem]'>
          <h2 className='title4 text-gray-900'>자주 묻는 질문</h2>
          <p className='body5 text-gray-600'>자주 묻는 질문을 확인해 보세요!</p>
        </div>
        <Faq items={FAQ_ITEMS} />
      </section>
    </div>
  );
}
