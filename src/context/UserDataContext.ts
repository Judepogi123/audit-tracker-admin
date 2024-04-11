import { useContext, createContext } from "react";

interface UserProps {
  username: string;
  profilePicture?: string;
  userType?: string;
  userFullname?: string;
  userZoneId?: number;
  userAddress?: string;
}

export const UserDataProvider = createContext<UserProps | undefined>(undefined);

export const useUserData = () => {
  const context = useContext(UserDataProvider);
  if (context === undefined) {
    throw new Error("Sorry, the must only use inside the provider.");
  }
  return context
};
