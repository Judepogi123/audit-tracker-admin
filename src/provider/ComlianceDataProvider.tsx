import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "../../server/api/axios";

import Header from "../pages/compliance/_header/Header";
import ComplianceData from "../pages/compliance/_content/ComplianceData";
import Compliance from "../pages/compliance/Compliance";

interface RequirementsProps {
  condition: string;
  value: { id: string; query: string; status: boolean }[];
}

interface ValueProps {
  title: string;
  key: string;
}

interface IndicatorsProps {
  dataInputMethod: {
    type: null | string;
    value: ValueProps[] | string | number;
  };
  query: string;
  id: string;
  mov: string;
  movDueDate: string | undefined | "null";
  title: string;
  type: "indicator" | "subIndicator";
  subIndicator?: IndicatorsProps[];
  stage: number;
  status: boolean;
  answer: string;
}

interface ComplianceDataProps {
  fieldAnswers: IndicatorsProps[];
  fieldPushKey: string;
  pushKey: string;
  sender: string;
  status: string;
  timestamp: string;
  viewed: boolean;
  zipCode: string;
}

const ComplianceDataContext = createContext<ComplianceDataProps[] | undefined>(
  undefined
);

const ComplianceDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<ComplianceDataProps[] | undefined>();

  const {
    data: complianceData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["complianceData"],
    queryFn: () => axios.get("/data/compliance"),
  });

  useEffect(() => {
    if (complianceData?.data) {
      const temp = JSON.stringify(complianceData.data);
      localStorage.setItem("compliance", temp);
    }

    const localTemp = localStorage.getItem("compliance");
    if (localTemp) {
      const temp: ComplianceDataProps[] = JSON.parse(localTemp);
      setData([...temp]);
    }
  }, []);

  return (
    <ComplianceDataContext.Provider value={data}>
      {children}
    </ComplianceDataContext.Provider>
  );
};

export default ComplianceDataProvider;

export const useComplianceData = () => {
  const context = useContext(ComplianceDataContext);
  if (!context) {
    throw new Error("Compliane data must use only inside the provider");
  }
  return context;
};
