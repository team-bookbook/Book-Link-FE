import { createBrowserRouter } from 'react-router-dom';
import Layout from '@layouts/layout';
import ErrorPage from '@pages/error/error-page';
import HomePage from '@pages/home/home-page';
import LibraryPage from '@pages/library/library-page';
import SettingPage from '@pages/setting/setting-page';
import BoardPage from '@pages/board/board-page';
import ChatPage from '@pages/chat/chat-page';
import NotificationPage from '@pages/notification/notification-page';
import LoginPage from '@pages/login/login-page';
import SignupPage from '@pages/signup/signup-page';
import { ROUTES } from '@routes/routes-config';
import MyLoanPage from '@pages/home/my-loan-page';
import MyReservationPage from '@pages/home/my-reservation-page';
import MyGroupPage from '@pages/home/my-group-page';

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
      { path: ROUTES.NOTIFICATION, element: <NotificationPage /> },
      { path: ROUTES.MY_RESERVATION, element: <MyReservationPage /> },
      { path: ROUTES.MY_LOAN, element: <MyLoanPage /> },
      { path: ROUTES.MY_GROUP, element: <MyGroupPage /> },
    ],
  },
]);
