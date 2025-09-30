import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import { ROUTES } from '@routes/routes-config';

const Layout = lazy(() => import('@layouts/layout'));
const ErrorPage = lazy(() => import('@pages/error/error-page'));

const HomePage = lazy(() => import('@pages/home/home-page'));
const LibraryPage = lazy(() => import('@pages/library/library-page'));
const SettingPage = lazy(() => import('@pages/setting/setting-page'));
const BoardPage = lazy(() => import('@pages/board/board-page'));
const ChatPage = lazy(() => import('@pages/chat/chat-page'));
const ChatDetailPage = lazy(() => import('@pages/chat/chat-detail-page'));
const NotificationPage = lazy(() => import('@pages/notification/notification-page'));
const LoginPage = lazy(() => import('@pages/login/login-page'));
const SignupPage = lazy(() => import('@pages/signup/signup-page'));
const OnboardingPage = lazy(() => import('@pages/onboarding/onboarding-page'));
const LibraryCreatePage = lazy(() => import('@pages/library/library-create-page'));
const BookCreatePage = lazy(() => import('@pages/library/book-create-page'));

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.LIBRARY, element: <LibraryPage /> },
      { path: ROUTES.SETTING, element: <SettingPage /> },
      { path: ROUTES.BOARD, element: <BoardPage /> },
      { path: ROUTES.CHAT, element: <ChatPage /> },
      { path: ROUTES.CHAT_ROOM(':id'), element: <ChatDetailPage /> },
      { path: ROUTES.NOTIFICATION, element: <NotificationPage /> },
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.SIGNUP, element: <SignupPage /> },
      { path: ROUTES.ONBOARDING, element: <OnboardingPage /> },
      { path: ROUTES.LIBRARY_CREATE, element: <LibraryCreatePage /> },
      { path: ROUTES.BOOK_CREATE, element: <BookCreatePage /> },
    ],
  },
]);
