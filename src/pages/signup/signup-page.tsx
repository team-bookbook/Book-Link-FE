import ProgressBar from '@pages/signup/components/progress-bar';
import { Funnel, StepView, useFunnel } from '@libs/funnel';
import { SignupDataProvider } from '@pages/signup/signup-data-context';
import StepNameNick from '@pages/signup/components/step-name-nick';
import StepEmail from '@pages/signup/components/step-email';
import StepEmailCode from '@pages/signup/components/step-email-code';
import StepAddress from '@pages/signup/components/step-address';

const STEPS = ['nameNick', 'email', 'emailCode', 'address' /* 'phone', 'password', 'complete' */] as const;

export default function SignupFunnelPage() {
  return (
    <SignupDataProvider>
      <Funnel steps={[...STEPS]} initial='nameNick'>
        <HeaderProgress />
        <StepView when='nameNick'>
          <StepNameNick />
        </StepView>
        <StepView when='email'>
          <StepEmail />
        </StepView>
        <StepView when='emailCode'>
          <StepEmailCode />
        </StepView>
        <StepView when='address'>
          <StepAddress />
        </StepView>
      </Funnel>
    </SignupDataProvider>
  );
}

function HeaderProgress() {
  const { index, steps } = useFunnel();
  return (
    <div className='px-[2rem] pt-[1.6rem]'>
      <ProgressBar
        step={index + 1}
        steps={steps.length}
        heightClassName='h-[0.6rem]'
        roundedClassName='rounded-full'
        trackClassName='bg-gray-200'
        barClassName='bg-system-success'
        ariaLabel='회원가입 진행률'
      />
    </div>
  );
}
