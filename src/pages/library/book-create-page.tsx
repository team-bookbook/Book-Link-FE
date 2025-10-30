import { useState } from 'react';
import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import Input from '@components/input/input';
import Icon from '@components/icon';
import useImageUpload from '@hooks/use-image-upload';

export default function BookCreatePage() {
  const { fileRef, images, openFilePicker, handleFileChange, removeImage } = useImageUpload({ mode: 'multiple' });

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [desc, setDesc] = useState('');
  const [deposit, setDeposit] = useState('');

  const canSubmit = images.length >= 3 && title.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    const payload = {
      images: images.map((p) => p.url),
      title: title.trim(),
      author: author.trim(),
      publisher: publisher.trim(),
      price: price.trim(),
      category: category.trim(),
      description: desc.trim(),
      deposit: deposit.trim(),
    };
    console.log('create book payload ->', payload);
  };

  return (
    <div className='bg-gray-white min-h-dvh text-gray-900'>
      <div className='mx-auto w-full space-y-[3.5rem] px-[2rem] pt-[2rem] pb-[10rem]'>
        <div className='flex-col gap-[0.8rem]'>
          <label className='body5'>책 이미지 (최소 3장으로 앞, 뒤, 내부 사진 업로드)</label>

          <Button
            variant='primary'
            fullWidth
            className='py-[1.2rem]'
            onClick={openFilePicker}
            roundStyle='rounded-[12px]'
          >
            이미지 업로드
          </Button>
          <input ref={fileRef} type='file' accept='image/*' multiple onChange={handleFileChange} className='hidden' />
          {images.length > 0 && (
            <div className='grid grid-cols-2 gap-[0.8rem]'>
              {images.map((img) => (
                <div
                  key={img.id}
                  className='relative grid h-[15rem] w-full place-items-center overflow-hidden rounded-[12px] bg-gray-100'
                >
                  <Icon
                    name='cancel'
                    size={1.5}
                    className='absolute top-[1rem] right-[1rem] cursor-pointer text-gray-400'
                    ariaHidden
                    onClick={() => removeImage(img.id)}
                  ></Icon>
                  {img.url ? (
                    <img src={img.url} alt='' className='h-full w-full object-cover' />
                  ) : (
                    <Icon name='book' size={3.2} className='text-gray-400' ariaHidden />
                  )}
                </div>
              ))}
            </div>
          )}
          <p className='body5 text-primary-700'>처음에 등록한 사진이 목록에 노출됩니다.</p>
        </div>

        <Input
          id='book-title'
          label='책 제목'
          placeholder='책 제목을 입력해 주세요.'
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />

        <Input
          id='book-author'
          label='작가'
          placeholder='작가를 입력해 주세요.'
          value={author}
          onChange={(e) => setAuthor(e.currentTarget.value)}
        />

        <Input
          id='book-publisher'
          label='출판사'
          placeholder='출판사를 입력해 주세요.'
          value={publisher}
          onChange={(e) => setPublisher(e.currentTarget.value)}
        />

        <Input
          id='book-price'
          label='정가'
          placeholder='정가를 입력해 주세요.'
          inputMode='numeric'
          value={price}
          onChange={(e) => setPrice(e.currentTarget.value.replace(/[^\d]/g, ''))}
        />

        <Input
          id='book-category'
          label='카테고리'
          placeholder='카테고리를 입력해 주세요.'
          value={category}
          onChange={(e) => setCategory(e.currentTarget.value)}
        />

        <Input
          id='book-desc'
          label='상세 설명'
          placeholder='상세 설명을 작성해 주세요.'
          multiline
          maxLength={1000}
          hasLength
          value={desc}
          onChange={(e) => setDesc(e.currentTarget.value)}
          length={desc.length}
        />
        <div className='flex-col gap-[0.8rem]'>
          <Input
            id='book-deposit'
            label='보증금'
            placeholder='숫자만 입력해 주세요.'
            inputMode='numeric'
            value={deposit}
            onChange={(e) => setDeposit(e.currentTarget.value.replace(/[^\d]/g, ''))}
          />
          <p className='body5 text-primary-700'>보증금은 정가의 10%가 일반적입니다.</p>
        </div>
      </div>

      <ButtonFrame>
        <Button fullWidth roundStyle='rounded-[12px]' className='py-[1.2rem]' disabled={!canSubmit} onClick={submit}>
          도서 등록
        </Button>
      </ButtonFrame>
    </div>
  );
}
