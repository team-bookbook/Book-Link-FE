import 'keen-slider/keen-slider.min.css';
import { useNavigate } from 'react-router-dom';
import { useHomeData } from './hooks/use-home-data';
import HomeBanner from './components/banner/home-banner';
import HomeReservation from './components/section/home-reservation';
import HomeLoan from './components/section/home-loan';
import HomeGroup from './components/section/home-group';
import IntroduceBanner from './components/banner/introduce-banner';
import Divider from '@components/divider';
import { HOME_SECTION_TITLES, HOME_SECTIONS } from './constants/sections';
import { INTRODUCE_STEPS } from './constants/introduce';
import { FAQ_ITEMS } from './constants/faq';
import Faq from './components/faq/faq';
import { ROUTES } from '@routes/routes-config';
import TopMessageBanner from './components/banner/top-message-banner';

export default function HomePage() {
  const navigate = useNavigate();

  const handleLoanViewAll = () => {
    navigate(ROUTES.MY_LOAN);
  };

  const handleReservationViewAll = () => {
    navigate(ROUTES.MY_RESERVATION);
  };

  const handleGroupViewAll = () => {
    navigate(ROUTES.MY_GROUP);
  };

  const { loanData, reservationData, groupData, isLoadingLoans, isLoadingReservations, isLoadingGroups, error } =
    useHomeData();

  console.log(error);

  const hasData = loanData.length > 0 && groupData.length > 0 && reservationData.length > 0;

  const renderUserGreeting = () => (
    <div className='flex-col gap-[1.2rem] px-[2rem]'>
      <p className='title5 px-[0.6rem]'>
        <span className='text-primary-800'>북북</span>
        <span className='text-gray-600'>님 안녕하세요!</span>
      </p>
      <HomeBanner hasLoan={hasData} title={hasData ? '모순' : undefined} dday={hasData ? 1 : undefined} />
    </div>
  );

  const renderCurrentPoint = () => {
    const progressPercentage = 35;

    return (
      <div className='flex-row-center gap-[1.5rem] px-[2rem]'>
        <div className='h-[12.8rem] min-h-[12.8rem] w-full flex-col gap-[1.5rem] rounded-[0.8rem] bg-white p-[2rem]'>
          <div className='flex-row-between'>
            <h1 className='title5 text-gray-900'>보유 포인트</h1>
            <h1 className='title5 text-secondary-900'>1000p</h1>
          </div>
          <h2 className='body5 text-gray-700'>
            <span className='text-primary-900'>9000p</span> 더 모으면 상품권으로 교환할 수 있어요!
          </h2>
          <div className='relative h-[1.2rem] rounded-[2rem] bg-gray-100'>
            <div
              className='bg-secondary-900 h-full min-h-[1.2rem] rounded-[2rem] transition-all duration-300'
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  const renderDataSections = () => (
    <>
      <HomeReservation
        title={HOME_SECTION_TITLES.reservation}
        data={reservationData}
        isLoading={isLoadingReservations}
        onLinkClick={handleReservationViewAll}
      />
      <HomeLoan
        title={HOME_SECTION_TITLES.loan}
        data={loanData}
        isLoading={isLoadingLoans}
        onLinkClick={handleLoanViewAll}
      />
      <HomeGroup
        title={HOME_SECTION_TITLES.group}
        data={groupData}
        isLoading={isLoadingGroups}
        onLinkClick={handleGroupViewAll}
      />
    </>
  );

  const renderIntroduceSections = () => (
    <>
      <div className='flex-col gap-[1.5rem]'>
        <div className='flex-col gap-[0.2rem] px-[2rem] py-[1rem]'>
          <h2 className='title4 text-gray-900'>{HOME_SECTIONS.howTo.title}</h2>
          <p className='body5 text-gray-600'>{HOME_SECTIONS.howTo.description}</p>
        </div>
        <div className='flex-col-center gap-[1.5rem] border-gray-100 px-[2rem]'>
          {INTRODUCE_STEPS.map((step) => (
            <IntroduceBanner
              key={step.id}
              id={step.id}
              title={step.title}
              stepText={step.stepText}
              variant={step.variant}
            />
          ))}
        </div>
        <Divider />
      </div>

      <section className='flex-col gap-[1rem] px-[1.5rem]'>
        <div className='flex-col gap-[0.2rem] px-[0.5rem] py-[1rem]'>
          <h2 className='title4 text-gray-900'>{HOME_SECTIONS.faq.title}</h2>
          <p className='body5 text-gray-600'>{HOME_SECTIONS.faq.description}</p>
        </div>
        <Faq items={FAQ_ITEMS} />
      </section>
    </>
  );

  return (
    <>
      <TopMessageBanner />
      <div className='flex-col gap-[3rem] bg-gray-50 py-[2.5rem]'>
        {renderUserGreeting()}
        <Divider />
        {renderCurrentPoint()}
        {hasData ? renderDataSections() : renderIntroduceSections()}
      </div>
    </>
  );
}
