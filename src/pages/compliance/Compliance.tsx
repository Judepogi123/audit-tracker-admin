import React, { useEffect, useState } from "react";
import { useNavigate, Outlet, useSearchParams } from "react-router-dom";
import axios from "../../../server/api/axios";
import { useQuery } from "@tanstack/react-query";

import Layout from "../../components/Layout";
import Button from "../../components/Button";
import Select from "../../components/Select";
import Spinner from "../../components/Spinner";
import { handleGetValueLabel } from "../../utils/_global-functions";

import { Badge, Typography, message } from "antd";
import { useComplianceData } from "../../provider/ComlianceDataProvider";
import Header from "./_header/Header";
import { OptionProps } from "antd/es/select";

import Content from "./_content/Content";

interface MunicipalitiesProps {
  municipalityName: string;
  zipCode: number;
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

interface ComplianceDataProps {
  fieldAnswer: string;
  fieldPushKey: string;
  pushKey: string;
  sender: string;
  status: string;
  timestamp: string;
  viewed: boolean;
  zipCode: string;
}

interface FieldProps {
  id: string;
  title: string;
  type: string;
  dependencies: { method: string; value: number };
  description: string;
  pushKey: string;
}

const Compliance = () => {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const [complianceList, setComplianceList] = useState<
    ComplianceDataProps[] | []
  >([]);
  const [selectedField, setSelectedField] = useState<string>("all");
  const [messageApi, contextMessage] = message.useMessage();
  const [fieldsList, setFieldsList] = useState<
    { label: string | React.ReactNode; key: string }[] | undefined
  >(undefined);

  const [searchParams, setSearchParams] = useSearchParams({ area: "" });
  const navigate = useNavigate();

  const {
    data: towns,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => axios.get("/data/municipalities"),
    queryKey: ["towns"],
  });

  const {
    data: complianceDataList,
    isError: complianceError,
    isLoading: complianceIsLoading,
  } = useQuery({
    queryKey: ["complianceDataList"],
    queryFn: () => axios.get(`/data/compliance`),
  });

  const {
    data: fields,
    isError: fieldIsError,
    isLoading: fieldIsLoading,
  } = useQuery({
    queryKey: ["fields"],
    queryFn: () => axios.get("/data/audit-fields"),
  });

  useEffect(() => {
    if (complianceDataList?.data) {
      const temp = JSON.stringify(complianceDataList.data);
      localStorage.setItem("dataList", temp);
    }
    const tempData = localStorage.getItem("dataList");
    if (tempData) {
      const temp = JSON.parse(tempData);
      setComplianceList(temp);
    }
  }, [complianceDataList?.data]);

  useEffect(() => {
    try {
      navigate(`/compliance/${selectedField}`);
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`);
    }
  }, [selectedField]);

  const handleGetNewCount = (pushKey: string) => {
    if (complianceList && !isError && !isLoading) {
      const newCopy = [...Object.values(complianceList as DataProps[])];
      return newCopy.filter(
        (item) => item.fieldPushKey === pushKey && !item.viewed
      ).length;
    }
    return 0;
  };

  const handleGetLabelAndKey = (list: FieldProps[]) => {
    if(!Array.isArray(list))return
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

  const handleSetFields = () => {
    if (fields?.data) {
      const tempString = JSON.stringify(fields.data);
      localStorage.setItem("fieldDataList", tempString);
    }
    const dataString = localStorage.getItem("fieldDataList");
    if (dataString) {
      const temp: FieldProps[] = JSON.parse(dataString);
      const tempWithCount = handleGetLabelAndKey(temp);
      setFieldsList(tempWithCount);
    }
  };

  useEffect(() => {
    handleSetFields();
  }, [fields?.data]);

  // {
  //   fieldIsLoading && isLoading ? (
  //     <Layout
  //       style={{
  //         width: "100%",
  //         height: "100%",
  //         backgroundColor: "#fff",
  //         display: "grid",
  //       }}
  //     >
  //       <div>Loading...</div>
  //     </Layout>
  //   ) : (
  //     Object.values(fields?.data).length === 0 && Object.values(towns?.data).length ===0 && (
  //       <Layout
  //         style={{
  //           width: "100%",
  //           height: "100%",
  //           backgroundColor: "#fff",
  //           display: "grid",
  //         }}
  //       >
  //         <div style={{ margin: "auto", textAlign: "center" }}>
  //           <Typography style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
  //             Sorry something went wrong
  //           </Typography>
  //           <Typography>Try to refresh the page.</Typography>
  //         </div>
  //       </Layout>
  //     )
  //   );
  // }

  if(fieldsList === undefined){
    return (
      <Layout
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
            display: "grid",
          }}
        >
          <div style={{ margin: "auto", textAlign: "center" }}>
            <Typography style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              No fields found.
            </Typography>
            <Typography>Try to refresh the page.</Typography>
          </div>
        </Layout>
    )
  }

  if(fieldsList && towns?.data){
    return (
      <Layout style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}>
        {contextMessage}
        <div
          style={{
            width: "100%",
            height: "13%",
            overflow: "hidden",
          }}
        >
          <Header
            setSelectedMunicipal={setSelectedField}
            complianceList={complianceList}
            setFieldsList={setFieldsList}
            fieldsList={fieldsList}
          />
        </div>
        {isLoading ? (
          <div>
            <Spinner />
          </div>
        ) : (
          <>
            <div
              style={{
                width: "100%",
                height: "7%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "5px",
                padding: "0px 20px",
              }}
            >
              <div
                style={{
                  width: "200px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  textAlign: "center",
                }}
              >
                <Typography.Title style={{ width: "120px" }} level={5}>
                  Municipal:{" "}
                </Typography.Title>
                <Select
                  size="small"
                  style={{ width: "100px" }}
                  options={[{ value: "boac", label: "Boac" }]}
                />
              </div>
              <div
                style={{
                  width: "150px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  textAlign: "center",
                }}
              >
                <Typography.Title style={{ width: "120px" }} level={5}>
                  Year:{" "}
                </Typography.Title>
                <Select
                  size="small"
                  style={{ width: "100px" }}
                  options={[{ value: "2023", label: "2023" }]}
                />
              </div>
            </div>
            <div style={{ width: "100%", height: "80%" }}>
              <Content
                setComplianceList={setComplianceList}
                selectedField={selectedField}
                complianceList={complianceList}
                townList={towns?.data}
              />
            </div>
          </>
        )}
      </Layout>
    );
  }

  
};

export default Compliance;
