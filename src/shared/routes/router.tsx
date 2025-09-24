import { createBrowserRouter } from 'react-router-dom';
import Layout from '@layouts/layout';
import ErrorPage from '@pages/error/error-page';
import HomePage from '@pages/home/home-page';
import LibraryPage from '@pages/library/library-page';
import SettingPage from '@pages/setting/setting-page';
import BoardPage from '@pages/board/board-page';
import ChatPage from '@pages/chat/chat-page';
import { ROUTES } from '@routes/routes-config';

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
    ],
  },
]);
