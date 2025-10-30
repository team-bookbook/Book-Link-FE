import Button from '@components/button/button';
import Input from '@components/input/input';
import useDaumPostcode from '@hooks/use-daum-postcode';
import { EDIT_PROFILE_PLACEHOLDER, EDIT_PROFILE_TEXT } from '../constants/edit-profile.constants';

interface AddressSearchInputProps {
  zip: string;
  addr1: string;
  addr2: string;
  onZipChange: (zip: string) => void;
  onAddr1Change: (addr1: string) => void;
  onAddr2Change: (addr2: string) => void;
}

function AddressSearchInput({ zip, addr1, addr2, onZipChange, onAddr1Change, onAddr2Change }: AddressSearchInputProps) {
  const openPostcode = useDaumPostcode();

  const onSearchAddress = async () => {
    try {
      await openPostcode((d) => {
        const chosen = d.address || d.roadAddress || d.jibunAddress || '';
        onZipChange(d.zonecode);
        onAddr1Change(chosen);
      });
    } catch {
      /* */
    }
  };

  return (
    <>
      <div className='flex-col gap-[1rem]'>
        <div className='flex items-start gap-[0.8rem]'>
          <div className='flex-1'>
            <Input
              id='addr1'
              label={EDIT_PROFILE_TEXT.ADDRESS}
              placeholder={EDIT_PROFILE_PLACEHOLDER.ADDRESS}
              value={addr1}
              onChange={(e) => onAddr1Change(e.currentTarget.value)}
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
            {EDIT_PROFILE_TEXT.SEARCH_ADDRESS}
          </Button>
        </div>
        <Input
          id='zip'
          placeholder={EDIT_PROFILE_PLACEHOLDER.POSTAL_CODE}
          value={zip}
          onChange={(e) => onZipChange(e.currentTarget.value.replace(/\D+/gu, '').slice(0, 5))}
          inputMode='numeric'
          autoComplete='postal-code'
        />
      </div>
      <Input
        id='addr2'
        label={EDIT_PROFILE_TEXT.DETAIL_ADDRESS}
        placeholder={EDIT_PROFILE_PLACEHOLDER.DETAIL_ADDRESS}
        value={addr2}
        onChange={(e) => onAddr2Change(e.currentTarget.value)}
        autoComplete='address-line2'
      />
    </>
  );
}

export default AddressSearchInput;
