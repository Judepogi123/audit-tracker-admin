import { useEffect, useState } from "react";
import Layout from "../../components/Layout";

import { message, Typography } from "antd";

//controller
import { useQuery } from "@tanstack/react-query";
import axios from "../../../server/api/axios";
import { useNavigate,useLocation } from "react-router-dom";
import { useUserData } from "../../provider/DataProvider";

//interface
import {
  AreaProps,
  AuditProps,
  ComplianceDataProps,
  LocaleListProps,
} from "../../interface/compliance";

//utils
import { handleGetLocal, handleSaveLocal } from "../../utils/localStorage";
import {
  hanldeSearchItem,
  handleSearchName,
} from "./_external-function/_handleGetFieldName";

//icons
import { MdOutlineCallReceived } from "react-icons/md";
import { IoIosDoneAll } from "react-icons/io";
import { MdOutlineRateReview } from "react-icons/md";

interface ListProps {
  auditList: AuditProps[] | undefined;
  selectArea: [] | AreaProps[] | undefined;
  allLocale: [] | LocaleListProps[] | undefined;
  currentAudit: string | null;
  currentArea: string | null;
  currentLocale: string | null;
  currentStatus: string | null
  query: string;
}

const List = ({
  auditList,
  selectArea,
  allLocale,
  currentAudit,
  currentArea,
  currentLocale,
  currentStatus,
  query,
}: ListProps) => {
  const [dataList, setDataList] = useState<ComplianceDataProps[]>([]);
  
  const url = useLocation()
  const location = url.search
  console.log(location);
  
  const querykey = ["title", "zipCode","localeName"]

  const user = useUserData();
  const navigate = useNavigate();

  const [messageApi, contextMessage] = message.useMessage();

  const { data: complianceList, isError: complianceIsError } = useQuery({
    queryKey: ["complianceList"],
    queryFn: () => axios.get(`/data/compliance`),
  });

  const handleCache = async () => {
    try {
      const stringData: string = JSON.stringify(complianceList?.data);
      await handleSaveLocal("complianceList", stringData);
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`);
    }
  };

  useEffect(() => {
    handleCache();
  }, [complianceList?.data]);

  const handleGetLocalData = async () => {
    try {
      const temp = await handleGetLocal("complianceList");
      if (!temp) {
        setDataList([]);
        return;
      }
      const cache: ComplianceDataProps[] = JSON.parse(temp as string);
      const newCopy = cache.map((item) => ({
        ...item,
        title: hanldeSearchItem(item.fieldPushKey, selectArea) as string,
        localeName: handleSearchName(item.zipCode, allLocale) as string
      }));
      setDataList(newCopy);
    } catch (error) {
      messageApi.error(`Sorry something went wrong parsing data: ${error}`);
    }
  };
  

  useEffect(() => {
    handleGetLocalData();
  }, [complianceList?.data,]);

  const handleUpdateCheckBy = async (list: string) => {
    try {
      const temp = list ? JSON.parse(list) : [];
      let found = false;
      for (let item of temp) {
        if (item === user.userName) {
          found = true;
          break;
        }
      }
      if (!found) {
        temp.push(user.userName);
      }
      return JSON.stringify(temp);
    } catch (error) {
      messageApi.error(`Something went wrong: ${error}`);
    }
  };

  const handleViewCompliance = async (
    key: string,
    code: string,
    checkedBy: string
  ) => {
    let reviewed = await handleUpdateCheckBy(checkedBy);

    try {
      const matchedIndex = dataList?.findIndex((item) => item.pushKey === key);
      if (matchedIndex !== -1) {
        // Update local state
        setDataList((prevList) =>
          prevList?.map((item, index) =>
            index === matchedIndex ? { ...item, viewed: true } : item
          )
        );
        const response = await axios.post(`/data/update-props`, {
          user: user.userName,
          pushKey: key,
          code: code,
          userList: reviewed,
        });

        if (response.status === 200) {
          navigate(`/compliance/${code}/${key}`);
        } else {
          messageApi.error(`Update error.`);
        }
      } else {
        messageApi.error(`Item not found`);
      }
    } catch (error) {
      messageApi.error(`${error}`);
    }
  };

  if (dataList === undefined || complianceIsError) {
    return (
      <Layout style={{ width: "100%", height: "100%", display: "grid" }}>
        <div style={{ margin: "auto", textAlign: "center" }}>
          <Typography style={{ fontWeight: 600 }}>
            Sorry something went wrong.
          </Typography>
          <Typography>Please try to refresh the page</Typography>
        </div>
      </Layout>
    );
  }

  const handleFilterList = (): ComplianceDataProps[] => {
    if (!dataList || dataList.length === 0) {
      return [];
    }
    return dataList
      .reverse()
      .filter(
        (item) =>
          item.auditKey === currentAudit &&
          (currentArea === "all" || item.fieldPushKey === currentArea) &&
          (currentLocale === "all" || item.zipCode === currentLocale) && 
          (currentStatus === "all" || item.status === currentStatus) && 
          querykey.some((key)=> (item as any)[key]?.toLowerCase()?.includes(query?.toLowerCase()))
      );
  };

  return (
    <Layout style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}>
      {contextMessage}

      <div
        id="complianceList"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          padding: "4px 8px",
        }}
      >
        {handleFilterList().length < 1 ? (
          <div style={{ width: "100%", height: "100%", display: "grid" }}>
            <Typography style={{ margin: "auto" }}>
              No compliance found.
            </Typography>
          </div>
        ) : (
          handleFilterList().map((item) => (
            <div
              onClick={() =>
                handleViewCompliance(item.pushKey, item.zipCode, item.checkedBy)
              }
              key={item.pushKey}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
                backgroundColor: item.viewed === true ? "#fff" : "#dee2e6",
              }}
            >
              <div
                style={{ display: "flex", gap: "16px", alignItems: "center" }}
              >
                {item.status === "submitted" ? (
                  <MdOutlineCallReceived color="#000814" fontSize={30} />
                ) : item.status === "done" ? (
                  <IoIosDoneAll color="#000814" fontSize={30} />
                ) : item.status === "ongoing" ? (
                  <MdOutlineRateReview color="#000814" fontSize={30} />
                ) : (
                  ""
                )}
                <div>
                  <Typography style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                    {hanldeSearchItem(item.fieldPushKey, selectArea) }
                  </Typography>{" "}
                  <Typography>
                    {handleSearchName(item.zipCode, allLocale)}
                  </Typography>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography>
                  {item.timestamp}
                </Typography>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default List;
