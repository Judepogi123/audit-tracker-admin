import { useState, useContext, createContext, useEffect } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

import axios from "../../server/api/axios";
import { AxiosRequestConfig } from "axios";

import { Layout } from "antd";

import Spinner from "../components/Spinner";

interface UserProps {
  userIsArchived: false
  userName: string;
  userProfilePicture: string;
  userType: string;
  userFullName: string;
  userZoneId: number;
  userAddress: string;
  history: any;
  userPermission: string;
  userLocaleType: string
}

interface ProviderProps {
  children: React.ReactNode;
}

interface User {
  name: AxiosRequestConfig<any>;
}
export const DataMainProvider = createContext<UserProps | null>(null);

export const DataProvider = ({ children }: ProviderProps) => {
  const [userData, setUserData] = useState<UserProps | null>(null);

  const auth = useAuthUser() as User;

  const handleFetchData = async () => {
    const username = auth.name;
    try {
      const response = await axios.get(`/auth/user-data?username=${username}`);

      if (response.status === 200 && response.data) {
        console.log(response.data);
        setUserData(response.data);
      } else {
        console.error("Error fetching user data:", response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetchData();
    return () => setUserData(null);
  }, []);

  if (!userData) {
    return (
      <Layout style={{ width: "100%", height: "100vh", display: "grid" }}>
        <div style={{ margin: "auto" }}>
          <Spinner />
        </div>
      </Layout>
    );
  }

  return (
    <DataMainProvider.Provider value={{ ...userData, history }}>
      {userData && children}
    </DataMainProvider.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(DataMainProvider);
  if (!context) {
    throw new Error("The data must use only inside the data provider.");
  }
  return context;
};

export default DataProvider;