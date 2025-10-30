import Button from '@components/button/button';
import Input from '@components/input/input';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@routes/routes-config';
import ButtonFrame from '@components/button/button-frame';
import ProfileImageSection from './components/profile-image-section';
import MemberInfoSection from './components/member-info-section';
import { EDIT_PROFILE_PLACEHOLDER, EDIT_PROFILE_TEXT } from './constants/edit-profile.constants';

type Preview = { id: string; url: string };

function EditProfilePage() {
  const navigate = useNavigate();
  const [image, setImage] = useState<Preview | null>(null);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [zip, setZip] = useState('');
  const [addr1, setAddr1] = useState('');
  const [addr2, setAddr2] = useState('');

  const canSubmit = true;

  const goToPasswordReset = () => {
    navigate(ROUTES.PASSWORD_RESET);
  };

  const submit = () => {
    // TODO: 프로필 이미지 업데이트 API 호출
  };

  return (
    <div className='flex-col gap-[1rem] bg-gray-50 pb-[5rem]'>
      <div className='bg-gray-white flex-col gap-[3rem] rounded-br-[1.6rem] rounded-bl-[1.6rem] p-[2rem]'>
        <ProfileImageSection image={image} onImageChange={setImage} />
        <Input
          id='nickname'
          label={EDIT_PROFILE_TEXT.NICKNAME}
          placeholder={EDIT_PROFILE_PLACEHOLDER.NICKNAME}
          value={nickname}
          onChange={(e) => setNickname(e.currentTarget.value)}
        />
      </div>

      <MemberInfoSection
        userName='홍길동'
        email={email}
        phone={phone}
        zip={zip}
        addr1={addr1}
        addr2={addr2}
        onEmailChange={setEmail}
        onPhoneChange={setPhone}
        onZipChange={setZip}
        onAddr1Change={setAddr1}
        onAddr2Change={setAddr2}
        onPasswordChange={goToPasswordReset}
      />

      <div className='flex-row-between mt-[2rem] mb-[5rem] px-[2rem] text-center'>
        <p className='body5 w-[15rem] text-gray-500'>{EDIT_PROFILE_TEXT.LOGOUT}</p>
        <p className='body5 text-system-error w-[15rem]'>{EDIT_PROFILE_TEXT.WITHDRAW}</p>
      </div>

      <ButtonFrame>
        <Button fullWidth roundStyle='rounded-[12px]' className='py-[1.2rem]' disabled={!canSubmit} onClick={submit}>
          {EDIT_PROFILE_TEXT.SUBMIT}
        </Button>
      </ButtonFrame>
    </div>
  );
}

export default EditProfilePage;
