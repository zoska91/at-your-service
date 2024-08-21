import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const HomePage = () => {
  const { isLogin } = useUser();

  if (isLogin) return <Navigate to='/chat' />;

  return <div>Home page</div>;
};

export default HomePage;
