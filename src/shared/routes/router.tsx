import { createBrowserRouter } from 'react-router-dom';
import Layout from '@layouts/layout';
import ErrorPage from '@pages/error/error-page';
import HomePage from '@pages/home/home-page';
import LibraryPage from '@pages/library/library-page';
import SettingPage from '@pages/setting/setting-page';
import BoardPage from '@pages/board/board-page';
import ChatPage from '@pages/chat/chat-page';
import ChatDetailPage from '@pages/chat/chat-detail-page';
import NotificationPage from '@pages/notification/notification-page';
import LoginPage from '@pages/login/login-page';
import SignupPage from '@pages/signup/signup-page';
import OnboardingPage from '@pages/onboarding/onboarding-page';
import LibraryCreatePage from '@pages/library/library-create-page';
import BookCreatePage from '@pages/library/book-create-page';
import { ROUTES } from '@routes/routes-config';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.SIGNUP, element: <SignupPage /> },
      { path: ROUTES.LIBRARY, element: <LibraryPage /> },
      { path: ROUTES.SETTING, element: <SettingPage /> },
      { path: ROUTES.BOARD, element: <BoardPage /> },
      { path: ROUTES.CHAT, element: <ChatPage /> },
      { path: ROUTES.CHAT_ROOM(':id'), element: <ChatDetailPage /> },
      { path: ROUTES.ONBOARDING, element: <OnboardingPage /> },
      { path: ROUTES.LIBRARY_CREATE, element: <LibraryCreatePage /> },
      { path: ROUTES.BOOK_CREATE, element: <BookCreatePage /> },
      { path: ROUTES.NOTIFICATION, element: <NotificationPage /> },
    ],
  },
]);
