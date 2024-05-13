import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "../../../server/api/axios";
import { useSearchParams } from "react-router-dom";
import { handleSaveLocal, handleGetLocal } from "../../utils/localStorage";

import Layout from "../../components/Layout";
import Button from "../../components/Button";
import Tabs from "../../components/Tabs";
import Spinner from "../../components/Spinner";
import Input from "../../components/Input";
import Select from "../../components/Select";
import ErrorPage from "../error_page/ErrorPage";
import { Typography } from "antd";
import { TabsProps, message } from "antd";

import {
  AuditProps,
  AreaProps,
  LocaleListProps,
} from "../../interface/compliance";
import { FieldProps } from "../../interface/manage";

import Area from "./selection/Area";
import List from "./List";
import Locale from "./selection/Locale";

const ComplianceList = () => {
  const [messageApi, contextMessage] = message.useMessage();
  const [auditList, setAuditList] = useState<AuditProps[] | undefined>(
    undefined
  );
  const [selectedAudit, setSelectedAudit] = useState<string | undefined>(
    undefined
  );
  const [selectedArea, setSelectedArea] = useState<string | undefined>(
    undefined
  );
  const [selectArea, setAreaArea] = useState<AreaProps[] | []>();
  const [allFieldList, setAllFieldList] = useState<TabsProps["items"] | null>(
    null
  );
  const [allLocale, setAllLocale] = useState<LocaleListProps[] | []>();
  const [searchParams, setSearchParams] = useSearchParams({
    audit: `${auditList && auditList[0]?.key}`, locale: "all",area: "all"
  });
  const currentAudit = searchParams.get("audit");
  const currentLocale = searchParams.get("locale")
  const currentArea = searchParams.get("area")

  const handleChangePath = (value: string) => {
    setSelectedAudit(value);
    setSearchParams({ audit: value }, { replace: true });
    // Store the selected audit key in local storage
    localStorage.setItem("selectedAudit", value);
  };

  // const handleChangeLocale = (value: string) => {
  //   setSearchParams({ locale: value }, { replace: true });
  //   localStorage.setItem("selectedLocale", value);
  // };

  console.log(selectedArea);
  
  const {
    data: fieldList,
    isLoading: fieldIsLoading,
    isError,
  } = useQuery({
    queryKey: ["fieldList"],
    queryFn: () => axios.get("/data/field-list"),
  });

  // const {
  //   data: areas,
  //   isLoading: areasIsLoading,
  //   isError:areasIsError,
  // } = useQuery({
  //   queryKey: ["fieldList"],
  //   queryFn: () => axios.get("/data/areas"),
  // });

  const handleFieldCache = async () => {
    try {
      if (fieldList?.data) {
        const temp = JSON.stringify(fieldList.data);
        await handleSaveLocal("allFieldDataList", temp);
      }
      // if(areas?.data){
      //   const locale = JSON.stringify(areas.data);
      //   await handleSaveLocal("areasList", locale);
      // }
    } catch (error) {
      messageApi.error(`Something went wrong with caching data: ${error}`);
    }
  };

  useEffect(() => {
    handleFieldCache();
  }, [fieldList?.data]);

  const handleTabsItem = async () => {
    try {
      const localFields = await handleGetLocal("allFieldDataList");
      // const localArea = await handleGetLocal("areasList")
      // const allArea:AreaProps[] =  JSON.parse(localArea as string) 
      const parsedData: AuditProps[] = JSON.parse(localFields as string);
      setAuditList(parsedData);
      const defaultAuditKey = parsedData[0]?.key;
      const storedAudit = localStorage.getItem("selectedAudit");
      if (storedAudit) {
        setSelectedAudit(storedAudit);
        setSearchParams({ audit: storedAudit }, { replace: true });
      } else {
        setSearchParams({ audit: defaultAuditKey }, { replace: true });
      }
      let temp: TabsProps["items"] = [];
      for (let item of parsedData) {
        temp.push({ label: item.acronym, key: item.key });
      }
      setAllFieldList(temp);
    } catch (error) {
      messageApi.error(`Internal server: ${error}`);
    }
  };

  useEffect(() => {
    handleTabsItem();
  }, [fieldList?.data]);

  if (fieldIsLoading) {
    return (
      <Layout style={{ width: "100%", height: "100%", display: "grid" }}>
        <div style={{ margin: "auto" }}>
          <Spinner size="large" spinning={true} />
        </div>
      </Layout>
    );
  }

  if (!fieldList?.data || Object.values(fieldList?.data || []).length === 0) {
    return (
      <Layout style={{ width: "100%", height: "100%", display: "grid" }}>
        <div style={{ margin: "auto", textAlign: "center" }}>
          <Typography style={{ fontSize: "1.5rem" }}>
            No fields found to display
          </Typography>
          <Typography style={{ fontSize: "1rem" }}>
            {`To add fields go to Manage > Audit > Upate > Add`}
          </Typography>
        </div>
      </Layout>
    );
  }

  return (
    <Layout style={{ width: "100%", height: "100%%", backgroundColor: "#fff" }}>
      {contextMessage}
      <div style={{ width: "100%", height: "20%", padding: "8px" }}>
        {auditList && (
          <div style={{ width: "100%" }}>
            <Tabs
              activeKey={currentAudit as string}
              onChange={handleChangePath}
              items={allFieldList as TabsProps["items"]}
            />
          </div>
        )}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
          }}
        >
          <Input
            size={"small"}
            placeholder={"Search compliance"}
            variant={undefined}
          />
          <Area
          setSearchParams={setSearchParams}
          setSelectedArea={setSelectedArea}
            setArea={setAreaArea}
            selectedAudit={selectedAudit}
            messageApi={messageApi}
          />
          <Locale setAllLocale={setAllLocale} messageApi={messageApi} />
          <Select options={[]} size={undefined} />
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "80%",
          backgroundColor: "#fff",
          overflow: "auto",
        }}
      >
        <List
          currentAudit={currentAudit}
          allLocale={allLocale}
          auditList={auditList}
          selectArea={selectArea}
        />
      </div>
    </Layout>
  );
};

export default ComplianceList;
