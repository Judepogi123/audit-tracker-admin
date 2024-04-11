import React, { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "../../../../server/api/axios";

import Layout from "../../../components/Layout";
import Tabs from "../../../components/Tabs";
import Badge from "../../../components/Badge";
import { Typography, message } from "antd";

import "./style.scss";

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
  requirements: RequirementsProps[];
  indicators: IndicatorsProps[];
  pushKey: string;
}

interface DataProps {
  fieldAnnswer: string;
  fieldPushKey: string;
  pushKey: string;
  status: string;
  viewed: boolean;
  timestamp: string;
  zipCode: string;
  senderZ: string;
}

const Header = ({
  setSelectedMunicipal,
}: {
  setSelectedMunicipal: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [fields, setFields] = useState<
    { label: string | React.ReactNode; key: string }[] | undefined
  >(undefined);
  const [messageApi, contextMessage] = message.useMessage();
  const [Loading, setIsLoading] = useState<boolean>();
  const [errors, setErrors] = useState<string | undefined>();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["compliedCount"],
    queryFn: () => axios.get("/data/compliance"),
  });

  const handleGetNewCount = (pushKey: string) => {
    if (data?.data && !isError && !isLoading) {
      const newCopy = [...Object.values(data.data as DataProps[])];
      return newCopy.filter(item => item.fieldPushKey === pushKey && !item.viewed).length
    }
    return 0;
  };

  console.log(data?.data);
  

  const handleGetLabelAndKey = (list: FieldProps[]) => {
    let temp: { key: string; label: string | React.ReactNode }[] = [
      { key: "all", label: "All" },
    ];
    const listCopy = [...list];

    if (list && Array.isArray(list)) {
      for (let item of listCopy) {
        const newItem = {
          key: item.pushKey,
          label: (
            <Badge
              count={handleGetNewCount(item.pushKey)}
              children={item.title}
            />
          ),
        };
        temp.push(newItem);
      }
    }
    return temp;
  };

  const handleGetFields = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/data/audit-fields`);
      if (response.status === 200 && response.data) {
        const temp = handleGetLabelAndKey(response.data);
        setFields(temp);
        setIsLoading(false);
      } else {
        messageApi.error("No fields found to display.");
      }
    } catch (error) {
      messageApi.error(`${error}`);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetFields();
    return () => setFields(undefined);
  }, []);

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
          items={fields}
        />
      </div>
    </Layout>
  );
};

export default Header;
