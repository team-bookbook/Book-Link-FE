import queryClient from '@libs/query-client';
import '@styles/global.css';
import { QueryClientProvider } from '@tanstack/react-query';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='bg-linear-sky w-full h-full title6 text-black p-4'>Init Project</div>
    </QueryClientProvider>
  );
};
export default App;
