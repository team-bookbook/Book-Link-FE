import Button from '@components/button/button';
import Input from '@components/input/input';
import { EDIT_PROFILE_PLACEHOLDER, EDIT_PROFILE_TEXT } from '../constants/edit-profile.constants';
import AddressSearchInput from './address-search-input';

interface MemberInfoSectionProps {
  userName: string;
  email: string;
  phone: string;
  zip: string;
  addr1: string;
  addr2: string;
  onEmailChange: (email: string) => void;
  onPhoneChange: (phone: string) => void;
  onZipChange: (zip: string) => void;
  onAddr1Change: (addr1: string) => void;
  onAddr2Change: (addr2: string) => void;
  onPasswordChange: () => void;
}

function MemberInfoSection({
  userName,
  email,
  phone,
  zip,
  addr1,
  addr2,
  onEmailChange,
  onPhoneChange,
  onZipChange,
  onAddr1Change,
  onAddr2Change,
  onPasswordChange,
}: MemberInfoSectionProps) {
  return (
    <div className='bg-gray-white flex-col gap-[3rem] rounded-[1.6rem] px-[2rem] py-[3rem]'>
      <h1 className='title5 text-gray-900'>
        {userName} {EDIT_PROFILE_TEXT.MEMBER_INFO_SUFFIX}
      </h1>
      <div className='flex-col gap-[2.4rem]'>
        <Input
          id='email'
          label={EDIT_PROFILE_TEXT.EMAIL}
          placeholder={EDIT_PROFILE_PLACEHOLDER.EMAIL}
          value={email}
          onChange={(e) => onEmailChange(e.currentTarget.value)}
          inputMode='email'
          autoCapitalize='none'
          autoCorrect='off'
          autoComplete='email'
        />
        <Input
          id='phone'
          label={EDIT_PROFILE_TEXT.PHONE}
          placeholder={EDIT_PROFILE_PLACEHOLDER.PHONE}
          value={phone}
          onChange={(e) => onPhoneChange(e.currentTarget.value)}
          inputMode='tel'
          autoComplete='tel'
        />
        <AddressSearchInput
          zip={zip}
          addr1={addr1}
          addr2={addr2}
          onZipChange={onZipChange}
          onAddr1Change={onAddr1Change}
          onAddr2Change={onAddr2Change}
        />
      </div>
      <div>
        <div className='flex-col gap-[1.5rem]'>
          <h3 className='body5 text-gray-900'>{EDIT_PROFILE_TEXT.PASSWORD}</h3>
          <Button fullWidth variant='primary' className='min-h-[3.6rem] py-[1.2rem]' onClick={onPasswordChange}>
            {EDIT_PROFILE_TEXT.CHANGE_PASSWORD}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MemberInfoSection;
