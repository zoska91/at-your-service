import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useEffect } from 'react';

const ChatPage = () => {
  const { isLogin, checkUser } = useUser();

  useEffect(() => {
    checkUser();
  }, [isLogin]);

  if (!isLogin) return <Navigate to='/chat' />;

  return <div>chat</div>;
};

export default ChatPage;
