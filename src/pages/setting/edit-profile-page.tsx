import Button from '@components/button/button';
import Input from '@components/input/input';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@routes/routes-config';
import ButtonFrame from '@components/button/button-frame';
import ProfileImageSection from './components/profile-image-section';
import MemberInfoSection from './components/member-info-section';
import { EDIT_PROFILE_PLACEHOLDER, EDIT_PROFILE_TEXT } from './constants/edit-profile.constants';
import type { ImagePreview } from '@hooks/use-image-upload';
import { useQuery, useMutation } from '@tanstack/react-query';
import { memberQueries } from '@apis/member/member-queries';
import { memberMutations } from '@apis/member/member-mutations';
import { isAuthenticated } from '@/shared/utils/auth';
import { toast } from '@libs/toast';
import { uploadImage } from '@apis/s3/s3-api';

function EditProfilePage() {
  const { data: memberData } = useQuery({
    ...memberQueries.GET_ME(),
    enabled: isAuthenticated(),
  });

  const navigate = useNavigate();
  const [image, setImage] = useState<ImagePreview | null>(null);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [zip, setZip] = useState('');
  const [addr1, setAddr1] = useState('');
  const [addr2, setAddr2] = useState('');

  const { mutate: updateMember } = useMutation(memberMutations.UPDATE_ME());

  useEffect(() => {
    if (memberData) {
      setNickname(memberData.nickName);
      setEmail(memberData.email);
      setPhone(memberData.phone);

      if (memberData.address) {
        const splitAddress = memberData.address.split(' ');
        const addr = splitAddress.slice(1).join(' ');
        const zip = splitAddress[0];
        setAddr1(addr);
        setZip(zip);
      }

      if (memberData.profileImage) {
        setImage({ id: 'existing', url: memberData.profileImage });
      }
    }
  }, [memberData]);

  const canSubmit = nickname.trim().length > 0 && phone.trim().length > 0;

  const goToPasswordReset = () => {
    navigate(ROUTES.PASSWORD_RESET);
  };

  const submit = async () => {
    if (!canSubmit) return;

    try {
      let profileImageUrl = memberData?.profileImage || '';

      if (image?.file) {
        profileImageUrl = await uploadImage(image.file);
        console.log('새 프로필 이미지 업로드:', profileImageUrl);
      }

      const fullAddress = [addr1.trim(), addr2.trim(), zip.trim()].filter(Boolean).join(' ').trim();

      updateMember(
        {
          nickname: nickname.trim(),
          address: fullAddress,
          phone: phone.trim(),
          profileImage: profileImageUrl,
        },
        {
          onSuccess: () => {
            toast.success('프로필이 수정되었습니다');
            navigate(-1);
          },
          onError: (error) => {
            toast.error('프로필 수정에 실패했습니다. 다시 시도해주세요');
            console.error(error);
          },
        }
      );
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해 주세요.');
    }
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
        userName={memberData?.name || ''}
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
