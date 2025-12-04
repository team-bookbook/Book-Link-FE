import GroupCard from '@pages/home/components/card/group-card';
import { useQuery } from '@tanstack/react-query';
import { groupQueries } from '@apis/group/group-queries';

interface SectionReadingProps {
  searchKeyword: string;
}

export default function SectionReading({ searchKeyword }: SectionReadingProps) {
  const { data: groups = [], isLoading: isLoadingGroups } = useQuery(
    groupQueries.GET_GROUP_LIST({
      name: searchKeyword || undefined,
    })
  );

  if (isLoadingGroups) {
    return <div className='body5 py-[4rem] text-center text-gray-500'>로딩 중...</div>;
  }

  return (
    <ul className='space-y-[1.2rem] bg-gray-50 px-[2.2rem] py-[2rem]'>
      {groups.length === 0 ? (
        <li className='body5 py-[4rem] text-center text-gray-500'>모임이 없습니다.</li>
      ) : (
        groups.map((group) => (
          <li key={group.id}>
            <GroupCard
              id={group.id}
              imgurl={group.thumbnail}
              groupName={group.name}
              hostName='hostName 필드 추가 필요'
              memberCount={group.participantCount}
              description={`Description 필드 추가 필요`}
              isPrivate={group.isPrivate}
            />
          </li>
        ))
      )}
    </ul>
  );
}
