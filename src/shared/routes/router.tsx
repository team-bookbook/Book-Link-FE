import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import { ROUTES } from '@routes/routes-config';

const Layout = lazy(() => import('@layouts/layout'));
const ErrorPage = lazy(() => import('@pages/error/error-page'));
const HomePage = lazy(() => import('@pages/home/home-page'));
const LibraryPage = lazy(() => import('@pages/library/library-page'));
const SettingPage = lazy(() => import('@pages/setting/setting-page'));
const BoardPage = lazy(() => import('@pages/board/board-page'));
const BoardDetailPage = lazy(() => import('@pages/board/board-detail-page'));
const GroupDetailPage = lazy(() => import('@pages/board/group-detail-page'));
const ChatPage = lazy(() => import('@pages/chat/chat-page'));
const ChatDetailPage = lazy(() => import('@pages/chat/chat-detail-page'));
const NotificationPage = lazy(() => import('@pages/notification/notification-page'));
const LoginPage = lazy(() => import('@pages/login/login-page'));
const SignupPage = lazy(() => import('@pages/signup/signup-page'));
const OnboardingPage = lazy(() => import('@pages/onboarding/onboarding-page'));
const LibraryCreatePage = lazy(() => import('@pages/library/library-create-page'));
const BookCreatePage = lazy(() => import('@pages/library/book-create-page'));
const ReservationPage = lazy(() => import('@pages/home/reservation-page'));
const GroupPage = lazy(() => import('@pages/home/group-page'));
const RentalPage = lazy(() => import('@pages/home/rental-page'));
const CartPage = lazy(() => import('@pages/library/cart-page'));
const BookDetailPage = lazy(() => import('@pages/library/book-detail-page'));
const LibraryDetailPage = lazy(() => import('@pages/library/library-detail-page'));
const LibraryBookPage = lazy(() => import('@pages/library/library-book-page'));
const LibraryReviewPage = lazy(() => import('@pages/library/library-review-page'));
const PrivacyPage = lazy(() => import('@pages/setting/privacy-page'));
const TermsOfService = lazy(() => import('@pages/setting/terms-of-service-page'));
const ReivewCreatePage = lazy(() => import('@pages/chat/review-create-page'));
const PasswordResetPage = lazy(() => import('@pages/setting/password-reset-page'));
const EditProfilePage = lazy(() => import('@pages/setting/edit-profile-page'));
const BoardCreatePage = lazy(() => import('@pages/board/board-create-page'));
const GroupCreatePage = lazy(() => import('@pages/board/group-create-page'));

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.LIBRARY, element: <LibraryPage /> },
      { path: ROUTES.SETTING, element: <SettingPage /> },
      { path: ROUTES.PRIVACY, element: <PrivacyPage /> },
      { path: ROUTES.TERMS_OR_SERVICE, element: <TermsOfService /> },
      { path: ROUTES.BOARD, element: <BoardPage /> },
      { path: ROUTES.BOARD_DETAIL(':id'), element: <BoardDetailPage /> },
      { path: ROUTES.GROUP_DETAIL(':id'), element: <GroupDetailPage /> },
      { path: ROUTES.BOARD_CREATE, element: <BoardCreatePage /> },
      { path: ROUTES.GROUP_CREATE, element: <GroupCreatePage /> },
      { path: ROUTES.CHAT, element: <ChatPage /> },
      { path: ROUTES.CHAT_ROOM(':id'), element: <ChatDetailPage /> },
      { path: ROUTES.NOTIFICATION, element: <NotificationPage /> },
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.SIGNUP, element: <SignupPage /> },
      { path: ROUTES.ONBOARDING, element: <OnboardingPage /> },
      { path: ROUTES.LIBRARY_CREATE, element: <LibraryCreatePage /> },
      { path: ROUTES.BOOK_CREATE, element: <BookCreatePage /> },
      { path: ROUTES.NOTIFICATION, element: <NotificationPage /> },
      { path: ROUTES.RESERVATION, element: <ReservationPage /> },
      { path: ROUTES.RENTAL, element: <RentalPage /> },
      { path: ROUTES.GROUP, element: <GroupPage /> },
      { path: ROUTES.CART, element: <CartPage /> },
      { path: ROUTES.BOOK_DETAIL(':id'), element: <BookDetailPage /> },
      { path: ROUTES.LIBRARY_DETAIL(':id'), element: <LibraryDetailPage /> },
      { path: ROUTES.LIBRARY_BOOK(':id'), element: <LibraryBookPage /> },
      { path: ROUTES.LIBRARY_REVIEW(':id'), element: <LibraryReviewPage /> },
      { path: ROUTES.REVIEW_CREATE(':id'), element: <ReivewCreatePage /> },
      { path: ROUTES.PASSWORD_RESET, element: <PasswordResetPage /> },
      { path: ROUTES.EDIT_PROFILE, element: <EditProfilePage /> },
    ],
  },
]);
