import { useState } from 'react';
import Input from '@components/input/input';
import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import { useFunnel } from '@libs/funnel';
import { useSignupData } from '@pages/signup/signup-data-context';
import useDaumPostcode from '@hooks/use-daum-postcode';

export default function StepAddress() {
  const { data, setData } = useSignupData();
  const { goNext } = useFunnel();
  const openPostcode = useDaumPostcode();

  const [touched, setTouched] = useState<{ zip: boolean; addr1: boolean }>({ zip: false, addr1: false });

  const zipValid = data.zip.trim().length > 0;
  const addr1Valid = data.addr1.trim().length > 0;
  const canNext = zipValid && addr1Valid;

  const onSearch = async () => {
    try {
      await openPostcode((d) => {
        const chosen = d.address || d.roadAddress || d.jibunAddress || '';
        setData({ zip: d.zonecode, addr1: chosen });
      });
    } catch {}
  };

  const onNext = () => {
    if (!canNext) {
      setTouched({ zip: true, addr1: true });
      return;
    }
    goNext();
  };

  return (
    <div className='min-h-dvh flex-col gap-[2.5rem] bg-white text-gray-900'>
      <div className='flex-col gap-[3.5rem] px-[2rem] py-[2rem]'>
        <h1 className='title3 text-gray-900'>주소를 입력해 주세요.</h1>

        <div className='flex-col gap-[2.4rem]'>
          <div className='flex items-start gap-3'>
            <div className='flex-1'>
              <Input
                id='addr1'
                label='주소'
                placeholder='주소를 검색해 주세요.'
                value={data.addr1}
                onChange={(e) => setData({ addr1: e.currentTarget.value })}
                onBlur={() => setTouched((t) => ({ ...t, addr1: true }))}
                isError={touched.addr1 && !addr1Valid}
                validationMessage={touched.addr1 && !addr1Valid ? '주소를 입력해 주세요.' : undefined}
              />
            </div>
            <Button
              onClick={onSearch}
              typoStyle='button4'
              roundStyle='rounded-[12px]'
              variant='primary'
              className='mt-[3rem] px-[2.4rem] py-[1.8rem]'
            >
              주소검색
            </Button>
          </div>

          <Input
            id='zip'
            label='우편번호'
            placeholder='우편번호'
            value={data.zip}
            onChange={(e) => setData({ zip: e.currentTarget.value.replace(/\D+/gu, '').slice(0, 5) })}
            onBlur={() => setTouched((t) => ({ ...t, zip: true }))}
            isError={touched.zip && !zipValid}
            validationMessage={touched.zip && !zipValid ? '우편번호를 입력해 주세요.' : undefined}
          />

          <Input
            id='addr2'
            label='상세주소'
            placeholder='상세주소를 입력해 주세요.'
            value={data.addr2}
            onChange={(e) => setData({ addr2: e.currentTarget.value })}
          />
        </div>
      </div>

      <ButtonFrame>
        <Button fullWidth className='py-[1.2rem]' onClick={onNext} disabled={!canNext}>
          다음
        </Button>
      </ButtonFrame>
    </div>
  );
}
