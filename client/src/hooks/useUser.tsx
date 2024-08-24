import { useUser as useUserClerk } from '@clerk/clerk-react';

export const useUser = () => {
  const { user } = useUserClerk();

  return {
    isLogin: Boolean(user),
    userId: user?.id,
    lastName: user?.lastName,
    firstName: user?.firstName,
    createdAt: user?.createdAt,
    email: user?.primaryEmailAddress?.emailAddress,
  };
};
