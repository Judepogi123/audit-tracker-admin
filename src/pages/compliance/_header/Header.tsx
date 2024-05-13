import React, { useEffect, useState, useMemo } from "react";

import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "../../../../server/api/axios";

import Layout from "../../../components/Layout";
import Tabs from "../../../components/Tabs";
import Badge from "../../../components/Badge";
import { Typography, message } from "antd";

import "./style.scss";

import { useComplianceData } from "../../../provider/ComlianceDataProvider";

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
}

interface RequirementsProps {
  condition: string;
  requiredId: string[];
}

interface FieldProps {
  id: string;
  title: string;
  type: string;
  dependencies: { method: string; value: number };
  description: string;
  requirements?: RequirementsProps[];
  indicators?: IndicatorsProps[];
  pushKey: string;
}

interface DataProps {
  fieldAnswer: string;
  fieldPushKey: string;
  pushKey: string;
  status: string;
  viewed: boolean;
  timestamp: string;
  zipCode: string;
  sender: string;
}

const Header = ({
  setSelectedMunicipal,
  complianceList,
  fieldsList,
  setFieldsList
}: {
  setSelectedMunicipal: React.Dispatch<React.SetStateAction<string>>;
  complianceList: DataProps[] | [];
  setFieldsList: React.Dispatch<React.SetStateAction<{ label: string | React.ReactNode; key: string }[] | undefined>>;
  fieldsList: { label: string | React.ReactNode; key: string }[] | undefined;
}) => {
  const [fields, setFields] = useState<
    { label: string | React.ReactNode; key: string }[] | undefined
  >(undefined);
  const [messageApi, contextMessage] = message.useMessage();

  useEffect(()=>{
    const temp = localStorage.getItem("fieldDataList")
    const data: { label: string | React.ReactNode; key: string }[] | undefined = JSON.parse(temp as string)
    setFieldsList(data)
  },[])
  

  return (
    <Layout style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}>
      {contextMessage}
      <div
        className="compliance-header"
        style={{
          width: "100%",
          height: "auto",
          display: "flex",
          gap: "5px",
          padding: "5px",
          overflow: "hidden",
        }}
      >
        <Tabs
          onChange={(key: string) => setSelectedMunicipal(key)}
          defaultActiveKey="all"
          items={fieldsList}
        />
      </div>
    </Layout>
  );
};

export default Header;
