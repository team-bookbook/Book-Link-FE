import queryClient from '@libs/query-client';
import '@styles/global.css';
import { QueryClientProvider } from '@tanstack/react-query';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='bg-blue-500 text-white p-4'>Init Project</div>
    </QueryClientProvider>
  );
};
export default App;
