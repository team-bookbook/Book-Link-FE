import queryClient from '@libs/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from '@routes/router';
import SplashGateRuntime from '@components/spash/runtime';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SplashGateRuntime>
        <RouterProvider router={router} />
      </SplashGateRuntime>
    </QueryClientProvider>
  );
}
