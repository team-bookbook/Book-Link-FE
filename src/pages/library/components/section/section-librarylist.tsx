import { useState } from 'react';
import LibraryCard from '@pages/library/components/card/library-card';
import { LIBRARY_LIST_LABELS, type LibraryListTab } from '@pages/library/constants/library-list';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@routes/routes-config';
import { libraryQueries } from '@apis/library/library-queries';
import { useQuery } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

export default function LibraryList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<LibraryListTab>('recommended');

  const queryParams = {
    lat: 15.341,
    lng: 12.341,
  };

  const { data, isLoading, error } = useQuery(libraryQueries.GET_LIBRARY(queryParams));
  console.log(data, isLoading, error);

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
          className='caption3 flex-row-center bg-gray-white cursor-pointer rounded-[8px] border border-gray-300 px-[1.3rem] py-[0.8rem]'
        >
          {LIBRARY_LIST_LABELS.myLibrary}
        </div>
      </div>
      <div className='flex-col gap-[2rem] px-[2rem]'>
        {data?.map((library) => (
          <LibraryCard key={uuidv4()} library={library} />
        ))}
      </div>
    </div>
  );
}
