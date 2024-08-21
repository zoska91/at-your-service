import { createBrowserRouter } from 'react-router-dom';
import ChatPage from '../pages/ChatPage';
import HomePage from '../pages/HomePage';
import RootLayout from '../layout/RootLayout';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/chat', element: <ChatPage /> },
    ],
  },
]);
