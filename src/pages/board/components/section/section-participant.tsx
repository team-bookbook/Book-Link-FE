import Icon from '@components/icon';
import { useQuery } from '@tanstack/react-query';
import { groupQueries } from '@apis/group/group-queries';

interface SectionParticipantProps {
  id: string;
}

export default function SectionParticipant({ id }: SectionParticipantProps) {
  const { data: members = [] } = useQuery(groupQueries.GET_GROUP_MEMBERS(id));

  return (
    <div className='flex-col gap-[1.2rem] p-[2rem]'>
      <div className='flex-col gap-[0.8rem]'>
        {members.length === 0 ? (
          <p className='body5 py-[4rem] text-center text-gray-500'>참여자가 없습니다.</p>
        ) : (
          members.map((member, index) => (
            <div key={member.id} className='flex items-center gap-[1.2rem] rounded-[8px] py-[1.2rem]'>
              <div className='flex-row-center h-[4rem] w-[4rem] rounded-full bg-gray-200'>
                <Icon name='profile' size={2.4} className='text-gray-600' />
              </div>
              <div className='flex-1 flex-col'>
                <div className='flex items-center gap-[0.6rem]'>
                  <h3 className='caption1'>{member.name}</h3>
                  {index === 0 && (
                    <span className='caption5 bg-primary-100 text-primary-700 rounded-[4px] px-[0.6rem] py-[0.2rem]'>
                      호스트
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
