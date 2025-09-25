import Faq from '@components/faq/faq';
import { FAQ_ITEMS } from '@components/faq/constants/faq';
import IntroduceBanner from '@components/banner/introduce-banner';
import { INTRODUCE_STEPS } from '@components/banner/constants/introduce';
import HomeBanner from '@components/banner/home-banner';

export default function HomePage() {
  return (
    <div className='bg-gray-50'>
      <HomeBanner hasLoan title='모순' dday={1} />
      <HomeBanner hasLoan={false} />
      <div className='flex-col-center gap-[1.5rem] px-[2rem] py-[2.5rem]'>
        {INTRODUCE_STEPS.map((s) => (
          <IntroduceBanner key={s.id} id={s.id} title={s.title} stepText={s.stepText} variant={s.variant} />
        ))}
      </div>
      <section className='flex-col gap-[1rem] px-[1.5rem]'>
        <div className='flex-col gap-[0.2rem] px-[0.5rem] py-[1rem]'>
          <h2 className='title4 text-gray-900'>자주 묻는 질문</h2>
          <p className='body5 text-gray-600'>간단한 단계로 도서관을 운영하세요!</p>
        </div>
        <Faq items={FAQ_ITEMS} />
      </section>
    </div>
  );
}
