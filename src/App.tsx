import { Suspense } from 'react';
import queryClient from '@libs/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from '@routes/router';
import LoadingSpinner from '@components/loading-spinner';

function OverlayFallback() {
  return (
    <div className='fixed inset-0 z-[10] grid min-h-dvh place-items-center'>
      <LoadingSpinner />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<OverlayFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  );
}
