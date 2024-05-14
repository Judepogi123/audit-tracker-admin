//controller
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "../../../server/api/axios";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";

//ui
import Layout from "../../components/Layout";
import Button from "../../components/Button";
import Tabs from "../../components/Tabs";
import Spinner from "../../components/Spinner";
import Input from "../../components/Input";
import Select from "../../components/Select";
import ErrorPage from "../error_page/ErrorPage";
import { Typography } from "antd";
import { TabsProps, message } from "antd";
import Lottie from "lottie-react";

//interface
import {
  AuditProps,
  AreaProps,
  LocaleListProps,
} from "../../interface/compliance";

//selection
import List from "./List";
import Locale from "./selection/Locale";
import AllArea from "./selection/AllArea";

//utils
import { handleSaveLocal, handleGetLocal } from "../../utils/localStorage";

//icons
import { TbZoomReset } from "react-icons/tb";
import loading from "../../assets/animations/loading-001.json";

const statusList: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Recieved" },
  { value: "ongoing", label: "On review" },
  { value: "done", label: "Reviewed" },
];

const ComplianceList = () => {
  const [messageApi, contextMessage] = message.useMessage();
  const [auditList, setAuditList] = useState<AuditProps[] | []>([]);
  const [selectArea, setAreaArea] = useState<AreaProps[] | []>();
  const [allFieldList, setAllFieldList] = useState<TabsProps["items"] | []>([]);
  const [allLocale, setAllLocale] = useState<LocaleListProps[] | []>([]);
  const [searchParams, setSearchParams] = useSearchParams({
    audit: `${auditList && auditList[0]?.key}`,
    locale: "all",
    area: "all",
    status: "all",
    query: "",
  });
  const currentAudit = searchParams.get("audit");
  const currentStatus = searchParams.get("status") || "all";
  const currentLocale = searchParams.get("locale") || "all";
  const currentArea = searchParams.get("area") || "all";
  const currentQuery = searchParams.get("query") || "";

  const [query] = useDebounce(currentQuery, 1000);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleChangePath = (value: string) => {
    setSearchParams(
      (prev) => {
        prev.set("audit", value);
        return prev;
      },
      { replace: true }
    );
    localStorage.setItem("selectedAudit", value);
  };

  const handleChangeArea = (value: string) => {
    //setCurrentArea(value);
    setSearchParams(
      (prev) => {
        prev.set("area", value);
        return prev;
      },
      { replace: true }
    );
  };

  const handleChangeLocale = (value: string) => {
    //setCurrentLocale(value);
    setSearchParams(
      (prev) => {
        prev.set("locale", value);
        return prev;
      },
      { replace: true }
    );
  };

  const handleChangeStatus = (value: string) => {
    //setCurrentStatus(value);
    setSearchParams(
      (prev) => {
        prev.set("status", value);
        return prev;
      },
      { replace: true }
    );
  };

  const handleSearchCompliance = (value: string) => {
    setSearchParams(
      (prev) => {
        prev.set("query", value);
        return prev;
      },
      { replace: true }
    );

    setIsTyping(true); // Set typing indicator to true when user starts typing

    setTimeout(() => {
      setIsTyping(false); // Set typing indicator to false after a delay
    }, 1000);
  };

  const handleResetFilter = () => {
    try {
      handleChangeStatus("all");
      handleChangeLocale("all");
      handleChangeArea("all");
      handleSearchCompliance("");
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`);
    }
  };

  const {
    data: fieldList,
    isLoading: fieldIsLoading,
    isError,
  } = useQuery({
    queryKey: ["fieldList"],
    queryFn: () => axios.get("/data/field-list"),
  });

  const {
    data: areas,
    isLoading: areasIsLoading,
    isError: areasIsError,
  } = useQuery({
    queryKey: ["areas"],
    queryFn: () => axios.get("/data/areas"),
  });

  const { data: localeList } = useQuery({
    queryKey: ["localeList"],
    queryFn: () => axios.get("/data/municipalities"),
  });

  console.log(areas?.data);

  const handleFieldCache = async () => {
    try {
      if (fieldList?.data) {
        const temp = JSON.stringify(fieldList.data);
        await handleSaveLocal("allFieldDataList", temp);
      }
      if (areas?.data) {
        const areasList = JSON.stringify(areas.data);
        await handleSaveLocal("areasList", areasList);
      }
      if (localeList?.data) {
        const locale = JSON.stringify(localeList.data);
        await handleSaveLocal("localeList", locale);
      }
    } catch (error) {
      messageApi.error(`Something went wrong with caching data12: ${error}`);
    }
  };

  useEffect(() => {
    handleFieldCache();
  }, [fieldList?.data, areas?.data]);

  const handleTabsItem = async () => {
    try {
      const localFields = await handleGetLocal("allFieldDataList");
      const localArea = await handleGetLocal("areasList");
      const allArea: AreaProps[] = JSON.parse(localArea as string);
      setAreaArea(allArea);
      const parsedData: AuditProps[] = JSON.parse(localFields as string);
      setAuditList(parsedData);
      const defaultAuditKey = parsedData[0]?.key;
      const storedAudit = localStorage.getItem("selectedAudit");
      if (storedAudit) {
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
      <div style={{ width: "100%", height: "25%", padding: "8px" }}>
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
            marginTop: "8px",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
            }}
          >
            <Input
              onChange={(e) => handleSearchCompliance(e.target.value)}
              size={"small"}
              placeholder={"Search compliance"}
              variant={undefined}
            />
            <Button onClick={handleResetFilter}>
              <TbZoomReset />
            </Button>
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              marginTop: "8px",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "auto",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <Typography style={{ fontWeight: 500 }}>Areas:</Typography>
              <AllArea
                handleChangeArea={handleChangeArea}
                currentArea={currentArea}
                currentAudit={currentAudit}
              />
            </div>

            <div
              style={{
                width: "auto",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <Typography style={{ fontWeight: 500 }}>Locale:</Typography>
              <Locale
                currentLocale={currentLocale}
                handleChangeLocale={handleChangeLocale}
                setAllLocale={setAllLocale}
                messageApi={messageApi}
                currentAudit={currentAudit}
              />
            </div>
            <div
              style={{
                width: "auto",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <Typography style={{ fontWeight: 500 }}>Status:</Typography>
              <Select
                value={currentStatus || "all"}
                onChange={handleChangeStatus}
                defaultValue={"all"}
                style={{ width: "200px" }}
                options={statusList}
                size={undefined}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "75%",
          backgroundColor: "#fff",
          overflow: "auto",
        }}
      >
        {isTyping ? (
          <Layout style={{ width: "100%", height: "100%", display: "grid" }}>
            <div style={{ margin: "auto", width: 200, textAlign: "center" }}>
              <Typography style={{fontWeight: 600, fontSize: "1.5rem"}}>Typing...</Typography>
            </div>
          </Layout>
        ) : (
          <List
            query={query}
            currentStatus={currentStatus}
            currentLocale={currentLocale}
            currentArea={currentArea}
            currentAudit={currentAudit}
            allLocale={allLocale}
            auditList={auditList}
            selectArea={selectArea}
          />
        )}
      </div>
    </Layout>
  );
};

export default ComplianceList;
