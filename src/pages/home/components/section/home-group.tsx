import HomeSectionLayout from '../layout/home-section-layout';
import GroupCard from '../card/group-card';
import type { IGroupCard } from '@pages/home/types/home.types';

interface HomeGroupProps {
  title: string;
  data: IGroupCard[];
  linkText?: string;
  isLoading?: boolean;
  onLinkClick?: () => void;
}

export default function HomeGroup({ title, data, linkText, isLoading, onLinkClick }: HomeGroupProps) {
  return (
    <HomeSectionLayout
      title={title}
      linkText={linkText}
      onLinkClick={onLinkClick}
      isLoading={isLoading}
      isEmpty={data.length === 0}
    >
      <div className='flex-col gap-[1.2rem] px-[2.2rem]'>
        {data.map((group, index) => (
          <GroupCard
            key={`${group.id}-${index}`}
            id={group.id}
            groupName={group.groupName}
            leaderName={group.leaderName}
            description={group.description}
            imgurl={group.imgurl}
            memberCount={group.memberCount}
          />
        ))}
      </div>
    </HomeSectionLayout>
  );
}
