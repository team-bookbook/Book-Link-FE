import Button from '@components/button/button';
import Icon from '@components/icon';
import Input from '@components/input/input';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@routes/routes-config';
import useDaumPostcode from '@hooks/use-daum-postcode';
import ButtonFrame from '@components/button/button-frame';

type Preview = { id: string; url: string };

function EditProfilePage() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const openPostcode = useDaumPostcode();
  const [image, setImage] = useState<Preview | null>(null);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [zip, setZip] = useState('');
  const [addr1, setAddr1] = useState('');
  const [addr2, setAddr2] = useState('');

  const canSubmit = true;

  const onPickImage = () => fileRef.current?.click();

  const onResetToDefault = () => {
    setImage(null);
    // TODO: 기본 이미지로 변경 API 호출
  };

  const goToPasswordReset = () => {
    navigate(ROUTES.PASSWORD_RESET);
  };

  const onSearchAddress = async () => {
    try {
      await openPostcode((d) => {
        const chosen = d.address || d.roadAddress || d.jibunAddress || '';
        setZip(d.zonecode);
        setAddr1(chosen);
      });
    } catch {
      /* */
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;

    const file = files[0]; // 첫 번째 파일만 사용

    const reader = new FileReader();
    reader.onload = () => {
      setImage({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        url: typeof reader.result === 'string' ? reader.result : '',
      });
    };
    reader.readAsDataURL(file);

    e.currentTarget.value = ''; // input 초기화
  };

  const submit = () => {
    // TODO: 프로필 이미지 업데이트 API 호출
  };

  return (
    <div className='flex-col gap-[1rem] bg-gray-50 pb-[5rem]'>
      <div className='flex-col gap-[3rem] p-[2rem]'>
        <div className='flex-col'>
          <h2 className='body5 mb-[1rem] text-gray-900'>프로필 사진</h2>
          <div className='flex-col-center'>
            <input ref={fileRef} type='file' accept='image/*' onChange={onFileChange} className='hidden' />
            <div className='relative mb-[1.5rem] h-[8rem] w-[8rem] overflow-hidden rounded-full'>
              {image ? (
                <img src={image.url} alt='사용자 프로필 사진' className='h-full w-full object-cover' />
              ) : (
                <Icon name='cat-profile' className='mb-[1.5rem] text-gray-300' size={8} ariaHidden />
              )}
            </div>
            <h2 className='caption3 mb-[2rem] text-gray-900'>BookLink에서 사용할 프로필 사진을 등록해주세요.</h2>
          </div>
          <div className='flex gap-[1rem]'>
            <Button fullWidth variant='outline' className='min-h-[3.6rem] py-[1.2rem]' onClick={onResetToDefault}>
              기본 이미지로 변경
            </Button>
            <Button fullWidth variant='outline' className='min-h-[3.6rem] py-[1.2rem]' onClick={onPickImage}>
              이미지 변경
            </Button>
          </div>
        </div>
        <Input
          id='nickname'
          label='닉네임'
          placeholder='닉네임을 입력해 주세요.'
          value={nickname}
          onChange={(e) => setNickname(e.currentTarget.value)}
        />
      </div>
      <div className='flex-col gap-[3rem] px-[2rem] pb-[2rem]'>
        <h1 className='title5 text-gray-900'>홍길동 님의 회원 정보</h1>
        <div className='flex-col gap-[2.4rem]'>
          <Input
            id='email'
            label='이메일'
            placeholder='이메일을 입력해 주세요.'
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            inputMode='email'
            autoCapitalize='none'
            autoCorrect='off'
            autoComplete='email'
          />
          <Input
            id='phone'
            label='휴대폰번호'
            placeholder='휴대폰번호 입력해 주세요.'
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
            inputMode='tel'
            autoComplete='tel'
          />

          <div className='flex-col gap-[1rem]'>
            <div className='flex items-start gap-[0.8rem]'>
              <div className='flex-1'>
                <Input
                  id='addr1'
                  label='주소'
                  placeholder='주소를 검색해 주세요.'
                  value={addr1}
                  onChange={(e) => setAddr1(e.currentTarget.value)}
                  autoComplete='street-address'
                />
              </div>
              <Button
                onClick={onSearchAddress}
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
              placeholder='우편번호'
              value={zip}
              onChange={(e) => setZip(e.currentTarget.value.replace(/\D+/gu, '').slice(0, 5))}
              inputMode='numeric'
              autoComplete='postal-code'
            />
          </div>
          <Input
            id='addr2'
            label='상세주소'
            placeholder='상세주소를 입력해 주세요.'
            value={addr2}
            onChange={(e) => setAddr2(e.currentTarget.value)}
            autoComplete='address-line2'
          />
        </div>
        <div>
          <div className='flex-col gap-[1.5rem]'>
            <h3 className='body5 text-gray-900'>비밀번호</h3>
            <Button fullWidth variant='primary' className='min-h-[3.6rem] py-[1.2rem]' onClick={goToPasswordReset}>
              비밀번호 변경하기
            </Button>
          </div>
        </div>
      </div>
      <div className='flex-row-between mb-[5rem] px-[2rem] text-center'>
        <p className='body5 w-[15rem] text-gray-500'>로그아웃</p>
        <p className='body5 text-system-error w-[15rem]'>회원탈퇴</p>
      </div>

      <ButtonFrame>
        <Button fullWidth roundStyle='rounded-[12px]' className='py-[1.2rem]' disabled={!canSubmit} onClick={submit}>
          수정하기
        </Button>
      </ButtonFrame>
    </div>
  );
}

export default EditProfilePage;
