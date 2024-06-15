import { User } from 'firebase/auth';

export const transformUser = (user: User | null) => {
  if (!user) return null;

  const { uid, email, displayName, photoURL } = user;
  return { uid, email, displayName, photoURL };
};
