import { useUser as useUserClerk } from '@clerk/clerk-react';
import useApi, { endpoints } from '../api';

export const useUser = () => {
  const { user } = useUserClerk();
  const { post } = useApi();

  const checkUser = () => {
    if (!user?.createdAt) return;

    const userData = {
      userId: user?.id,
      lastName: user?.lastName,
      firstName: user?.firstName,
      createdAt: user?.createdAt,
      email: user?.primaryEmailAddress?.emailAddress,
    };

    const userCreationDate = new Date(user?.createdAt);
    const isNewUser = new Date().getTime() - userCreationDate.getTime() < 0.5 * 60 * 60 * 1000;

    if (isNewUser) post(endpoints.createUser, userData);
  };

  return {
    isLogin: Boolean(user),
    checkUser,
    userId: user?.id,
    lastName: user?.lastName,
    firstName: user?.firstName,
    createdAt: user?.createdAt,
    email: user?.primaryEmailAddress?.emailAddress,
  };
};
