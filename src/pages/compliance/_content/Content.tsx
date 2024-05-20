import React, { useEffect } from "react";
import { FcDocument } from "react-icons/fc";
import Layout from "../../../components/Layout";

import { useNavigate, useSearchParams } from "react-router-dom";

import axios from "../../../../server/api/axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { MessageInstance } from "antd/es/message/interface";

import { Skeleton, Typography } from "antd";
import { handleSearchItem } from "../../../routes/info/audit/_external-function/main-list";

import "./style.scss";
import {
  hanldeSearchItem,
  handleSearchName,
} from "../_external-function/_handleGetFieldName";

interface ContentProps {
  messageApi?: MessageInstance;
  complianceList: DataProps[] | [];
  selectedField: string;
  setComplianceList: React.Dispatch<React.SetStateAction<[] | DataProps[]>>;
  townList: MunicipalProps[];
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
  path: string;
  title: string;
  type: "indicator" | "subIndicator";
  subIndicator: IndicatorsProps[];
  stage: number;
  status: boolean;
  answer: string;
  movFiles: string;
  pushKey: string;
  marked: boolean;
  notice: string
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

interface MunicipalProps {
  municipalityName: string;
  zipCode: number;
}

const Content = ({
  messageApi,
  complianceList,
  selectedField,
  setComplianceList,
  townList,
}: ContentProps) => {
  const { municipalID } = useParams();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams({ area: "" });
  const selectedTabs = searchParams.get("area")

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dataPost"],
    queryFn: () => axios.get("/data/compliance"),
  });

  const {
    data: fieldList,
    isLoading: fieldIsLoaidng,
    isError: fieldIsError,
  } = useQuery({
    queryKey: ["fieldList"],
    queryFn: () => axios.get(`/data/audit-fields`),
  });

  useEffect(() => {
    if (isError) {
      messageApi?.error(`Sorry, something went wrong:${isError}`);
    }
  }, [data, isError]);

  const handleSearchItem = (id: string, data: DataProps[]) => {
    const matchedItem = data.findIndex((item) => item.pushKey === id);

    const newData = [...data];
    if (matchedItem !== -1) {
      newData[matchedItem].viewed = true;
      localStorage.setItem("dataList", JSON.stringify(newData));
    }
    const temp = localStorage.getItem("dataList");
    setComplianceList(JSON.parse(temp as string));
  };

  const handleViewCompliance = async (
    zipCode: string,
    pushKey: string,
    status: boolean
  ) => {
    try {
      const tempData = localStorage.getItem("dataList");
      const parseTemp: DataProps[] = JSON.parse(tempData as string);
      if (status) {
        navigate(`/compliance/${zipCode}/${pushKey}`);
        handleSearchItem(pushKey, parseTemp);
        return;
      }
      const response = await axios.post("/data/update-props", {
        zipCode,
        pushKey,
      });

      if (response.status === 200) {
        navigate(`/compliance/${zipCode}/${pushKey}`);
        handleSearchItem(pushKey, parseTemp);
      } else {
        messageApi?.error("An error occurred. Please try again.");
      }
    } catch (error) {
      messageApi?.error(`Sorry, something went wrong. Please try again.: ${error}`);
    }
  };

  const {data:dataList, isError: complianceIsError, isLoading: complianceIsLoading} = useQuery({
    queryKey: ["dataList"],
    queryFn: ()=> axios.get("/data/compliance")
  })
  
  

  return (
    <Layout
      className="com-list"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        padding: "5px 10px",
        backgroundColor: "#fff",
        overflowX: "hidden",
      }}
    >{dataList?.data&& Object.values(dataList.data as DataProps[]).length <=0 && <Layout style={{}}>empty</Layout> }
      {isLoading ? (
        <Skeleton active={true} title={false} />
      ) : ( dataList?.data &&
        Object.values(dataList.data as DataProps[])
          .filter(
            (item) =>
              item.fieldPushKey === selectedField || selectedField === "all"
          )
          .reverse()
          .map((item, index) => (
            <CompianceItem
            key={index}
              townList={townList}
              fieldList={fieldList?.data}
              handleViewCompliance={handleViewCompliance}
              data={item}
            />
          ))
      )}
    </Layout>
  );
};

export default Content;

const CompianceItem = ({
  data,
  handleViewCompliance,
  fieldList,
  townList,
}: {
  data: DataProps;
  handleViewCompliance: (
    zipCode: string,
    pushKey: string,
    status: boolean
  ) => Promise<void>;
  fieldList: FieldProps[];
  townList: MunicipalProps[];
}) => {
  console.log(townList);
  
  return (
    <div
      className="item-compliance"
      onClick={() =>
        handleViewCompliance(data.zipCode, data.pushKey, data.viewed)
      }
      key={data.pushKey}
      style={{
        width: "100%",
        height: "auto",
        minHeight: "60px",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        border: "1px solid #ccc",
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        borderRadius: "5px",
        backgroundColor: data.viewed ? "" : "#caf0f8",
      }}
    >
      <div style={{ width: "auto", display: "flex", gap: "10px" }}>
        <FcDocument fontSize={25} />
        <Typography style={{ fontWeight: "bold" }}>
          {handleSearchName(parseInt(data.zipCode), Object.values(townList))}
        </Typography>
        <Typography>-</Typography>
        <Typography>
          {hanldeSearchItem(data.fieldPushKey, fieldList as FieldProps[])}
        </Typography>
      </div>
      <div style={{ width: "auto" }}>
        <Typography style={{ fontWeight: "normal" }}>
          {data.timestamp}
        </Typography>
      </div>
    </div>
  );
};
