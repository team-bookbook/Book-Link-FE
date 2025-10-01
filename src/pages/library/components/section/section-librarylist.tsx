import { useEffect, useMemo, useState } from 'react';
import CardLibrary from '../card/card-libray';
import type { ILibrary } from '@pages/library/types/library.types';
import { LIBRARY_LIST_LABELS, type LibraryListTab } from '@pages/library/constants/library-list';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@routes/routes-config';

export default function LibraryList() {
  const navigate = useNavigate();
  const [libraries, setLibraries] = useState<ILibrary[]>([]);
  const [activeTab, setActiveTab] = useState<LibraryListTab>('recommended');

  useEffect(() => {
    const mockLibraries: ILibrary[] = [
      {
        id: 1,
        name: '우리 도서관을 소개합니다!',
        owner: 'changchangwoo',
        followerCount: 14,
        description: '여기에 도서관 소개글이 작성됩니다. 도서관 소유자가 자유롭게 도서관 소개글을 작성할 수 있습니다.',
        profileImgUrl: undefined,
        coverImgUrl: undefined,
        isRecommended: true,
        isFavorite: false,
      },
      {
        id: 2,
        name: '동네 작은 책방',
        owner: 'bookLover88',
        followerCount: 32,
        description: '책을 사랑하는 사람들이 모이는 따뜻한 공간입니다. 다양한 장르의 책들을 보유하고 있어요.',
        profileImgUrl: 'https://picsum.photos/330/330?random=2',
        coverImgUrl: 'https://picsum.photos/330/330?random=4',
        isRecommended: true,
        isFavorite: true,
      },
      {
        id: 3,
        name: '동네 작은 책방',
        owner: 'bookLover99',
        followerCount: 32,
        description: '책을 사랑하는 사람들이 모이는 따뜻한 공간입니다. 다양한 장르의 책들을 보유하고 있어요.',
        profileImgUrl: undefined,
        coverImgUrl: 'https://picsum.photos/330/330?random=2',
        isRecommended: false,
        isFavorite: true,
      },
    ];
    setLibraries(mockLibraries);
  }, []);

  const filteredLibraries = useMemo(() => {
    return libraries.filter((library) => {
      if (activeTab === 'recommended') return library.isRecommended;
      if (activeTab === 'favorite') return library.isFavorite;
      return true;
    });
  }, [libraries, activeTab]);

  return (
    <div className='flex-col gap-[1.2rem] py-[2rem]'>
      <div className='flex-row-between px-[2rem]'>
        <div className='title6 flex gap-[1.5rem]'>
          <span
            onClick={() => setActiveTab('recommended')}
            className={`cursor-pointer ${activeTab === 'recommended' ? 'text-gray-900' : 'text-gray-500'}`}
          >
            {LIBRARY_LIST_LABELS.recommended}
          </span>
          <span
            onClick={() => setActiveTab('favorite')}
            className={`cursor-pointer ${activeTab === 'favorite' ? 'text-gray-900' : 'text-gray-500'}`}
          >
            {LIBRARY_LIST_LABELS.favorite}
          </span>
        </div>
        <div
          onClick={() => navigate(ROUTES.LIBRARY_DETAIL('my'))}
          className='caption3 flex-row-center bg-gray-white cursor-pointer rounded-[0.8rem] border border-gray-300 px-[1.3rem] py-[0.8rem]'
        >
          {LIBRARY_LIST_LABELS.myLibrary}
        </div>
      </div>
      <div className='flex-col gap-[2rem] px-[2rem]'>
        {filteredLibraries.map((library) => (
          <CardLibrary key={library.id} library={library} />
        ))}
      </div>
    </div>
  );
}
