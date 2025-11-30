import 'keen-slider/keen-slider.min.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useHomeData } from '@pages/home/hooks/useHomeData';
import HomeBanner from '@pages/home/components/banner/home-banner';
import HomeReservation from '@pages/home/components/section/home-reservation';
import HomeLoan from '@pages/home/components/section/home-loan';
import HomeGroup from '@pages/home/components/section/home-group';
import IntroduceBanner from '@pages/home/components/banner/introduce-banner';
import Divider from '@components/divider';
import { HOME_SECTION_TITLES, HOME_SECTIONS } from '@pages/home/constants/sections';
import { INTRODUCE_STEPS } from '@pages/home/constants/introduce';
import { FAQ_ITEMS } from '@pages/home/constants/faq';
import Faq from '@pages/home/components/faq/faq';
import { ROUTES } from '@routes/routes-config';
import TopMessageBar from '@pages/home/components/banner/top-message-bar';
import { useQuery } from '@tanstack/react-query';
import { memberQueries } from '@apis/member/member-queries';
import { isAuthenticated } from '@/shared/utils/auth';

export default function HomePage() {
  const navigate = useNavigate();

  // 비로그인 상태면 온보딩 페이지로 리다이렉트
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(ROUTES.ONBOARDING, { replace: true });
    }
  }, [navigate]);

  const handleLoanViewAll = () => {
    navigate(ROUTES.RENTAL);
  };

  const handleReservationViewAll = () => {
    navigate(ROUTES.RESERVATION);
  };

  const handleGroupViewAll = () => {
    navigate(ROUTES.GROUP);
  };

  const { data: memberData } = useQuery({
    ...memberQueries.GET_ME(),
    enabled: isAuthenticated(),
  });

  const { loanData, reservationData, groupData, isLoadingLoans, isLoadingReservations, isLoadingGroups } =
    useHomeData();

  const renderUserGreeting = () => {
    return (
      <div className='flex-col gap-[1.2rem] px-[2rem]'>
        <p className='title5 px-[0.6rem]'>
          <span className='text-primary-800'>{memberData ? memberData.nickName : '비회원'}</span>
          <span className='text-gray-600'>님 안녕하세요!</span>
        </p>
        <HomeBanner hasLoan={true} title='모순' dday={1} />
      </div>
    );
  };

  const renderCurrentPoint = () => {
    const pointBalance = memberData ? memberData.pointBalance : 0;
    const remainingPoints = 10000 - pointBalance;
    const progressPercentage = (pointBalance / 10000) * 100;

    return (
      <div className='flex-row-center gap-[1.5rem] px-[2rem]'>
        <div className='h-[12.8rem] min-h-[12.8rem] w-full flex-col gap-[1.5rem] rounded-[8px] bg-white p-[2rem]'>
          <div className='flex-row-between'>
            <h1 className='title5 text-gray-900'>보유 포인트</h1>
            <h1 className='title5 text-secondary-900'>{pointBalance}p</h1>
          </div>
          <h2 className='body5 text-gray-700'>
            <span className='text-primary-900'>{remainingPoints}p</span> 더 모으면 상품권으로 교환할 수 있어요!
          </h2>
          <div className='relative h-[1.2rem] rounded-[20px] bg-gray-100'>
            <div
              className='bg-secondary-900 h-full min-h-[1.2rem] rounded-[20px] transition-all duration-300'
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
      <TopMessageBar />
      <div className='flex-col gap-[3rem] bg-gray-50 py-[2.5rem]'>
        {renderUserGreeting()}
        <Divider />
        {renderCurrentPoint()}
        {memberData ? renderDataSections() : renderIntroduceSections()}
      </div>
    </>
  );
}
