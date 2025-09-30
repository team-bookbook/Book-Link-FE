import { useEffect, useState } from 'react';
import type { IGroupCard } from './types/home.types';
import { generateDummyGroups } from './hooks/useHomeData';
import GroupCard from './components/card/group-card';

export default function MyGroupPage() {
  const [dummy, setDummy] = useState<IGroupCard[]>([]);

  useEffect(() => {
    const response = generateDummyGroups(6);
    if (!response) return;
    setDummy(response);
  }, []);

  return (
    <div className='flex-col gap-[1.2rem] bg-gray-50 px-[2rem] pt-[2rem]'>
      {dummy.map((group) => (
        <GroupCard
          key={group.id}
          id={group.id}
          groupName={group.groupName}
          leaderName={group.leaderName}
          memberCount={group.memberCount}
          description={group.description}
          imgurl={group.imgurl}
        />
      ))}
    </div>
  );
}
