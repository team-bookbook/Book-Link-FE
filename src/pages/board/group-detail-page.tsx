import { useParams } from 'react-router-dom';

export default function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  console.log(id);
  return <main className='flex-col gap-[1.5rem] px-[1.5rem] py-[2.5rem]'></main>;
}
