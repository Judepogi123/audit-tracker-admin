import React, { useContext, useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import axios from "../../server/api/axios";
import { AxiosRequestConfig } from "axios";

import { UserDataProvider as DataProvider } from "../context/UserDataContext";

import Header from "../header/Header";
import Home from "../home/Home";

interface UserProps {
  username: string;
  profilePicture: string;
  userType: string;
  userFullname: string;
  userZoneId: number;
  userAddress: string;
}

interface User {
  name: AxiosRequestConfig<any>;
}

const UserDataProvider = () => {
  const [userData, setUserData] = useState<UserProps | undefined>(undefined);
  const auth = useAuthUser() as User;

  const handleFetchData = async () => {
    const username = auth.name;
    console.log(userData);

    try {
      const response = await axios.get(`/auth/user-data?username=${username}`);
      if(response.status === 200){
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
    return () => setUserData(undefined);
  }, []);

  return (
    <DataProvider.Provider value={userData}>
      <Header />
      <Home/>
    </DataProvider.Provider>
  );
};

export default UserDataProvider;
