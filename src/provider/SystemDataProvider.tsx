import React, { useContext, createContext, useState, useEffect } from "react";

import { useLocation } from "react-router-dom";
import axios from "../../server/api/axios";

interface ContextProps {
  children: React.ReactNode;
}

interface SystemDataProps {
  auditAcronym?: string;
  auditFullname?: string;
  fieldTitle?: string;
  currentPath?: string;
  systemDatas: SystemDataProps
}

const SystemDataContext = createContext<SystemDataProps | null>(null);

export const SystemDataProvider = ({ children }: ContextProps) => {
  const [systemData, setSystemData] = useState<SystemDataProps | null>(null);
  

  const location = useLocation()
  const currentPath = location.pathname;

  const handleFetchSystemData = async()=>{
    try {
        const response = await axios.get("data/system")
        if(response.data){            
            setSystemData({systemDatas: response.data, currentPath})
        }
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(()=>{
    handleFetchSystemData()
  },[])

  return (
    <SystemDataContext.Provider value={systemData}>
      {systemData && children}
    </SystemDataContext.Provider>
  );
};

export const useSystemData = ()=>{
    const systemContext = useContext(SystemDataContext)
    if(!systemContext){
        throw new Error("The system data must only use inside the provider.")
    }
    return systemContext
}

export default SystemDataProvider;
