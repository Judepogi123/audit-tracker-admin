import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../../server/api/axios";
import { handleGetUserInfo } from "../../../provider/UserDataProvider";
import { handleGetUserList } from "../../../utils/_list";
import {
  hanldeSearchItem,
  handleSearchName,
} from "../_external-function/_handleGetFieldName";
import { handleGenerateDate } from "../../../provider/CurrentDateProvider";

import Layout from "../../../components/Layout";
import IndicatorItem from "./IndicatorItem";
import Button from "../../../components/Button";
import Spinner from "../../../components/Spinner";
import ModalReturn from "./ModalReturn";
import ModalArchive from "./ModalArchive";
import Modal from "../../../components/Modal";
import Avatar from "../../../components/Avatar";
import Tooltip from "../../../components/Tooltip";

import { Avatar as GroupAvatars } from "antd";

import { BsExclamationCircle } from "react-icons/bs";
import { IoIosRefresh } from "react-icons/io";
import { IoArchiveOutline } from "react-icons/io5";

import { Typography, message } from "antd";
import { useQuery } from "@tanstack/react-query";

import { handleGetLocal } from "../../../utils/localStorage";

import { AreaProps, LocaleListProps } from "../../../interface/compliance";
import { UserProps } from "../../../interface/manage";

interface ComplianceDataProps {
  fieldAnswers: string;
  fieldPushKey: string;
  pushKey: string;
  sender: string;
  status: string;
  timestamp: string;
  viewed: boolean;
  zipCode: string;
  senderInfo: UserProps;
  parsedAnswer: IndicatorsProps[];
  checkedBy: string;
  reviewed: string;
  userList: UserProps[];
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
  path: string;
  type: "indicator" | "subIndicator";
  subIndicator: IndicatorsProps[];
  stage: number;
  status: boolean;
  answer: string;
  movFiles: string;
  pushKey: string;
  marked: boolean;
  notice: string;
}

interface FieldProps {
  id: string;
  title: string;
  type: string;
  dependencies: { method: string; value: number };
  description: string;
  indicators: IndicatorsProps[];
  pushKey: string;
}

const ComplianceData = () => {
  const { complianceID, zipCode } = useParams();
  const [messageApi, contextMessage] = message.useMessage();
  const [data, setData] = useState<ComplianceDataProps>();
  const [indicatorList, setIndicatorList] = useState<IndicatorsProps[] | []>();
  const [allField, setAllField] = useState<AreaProps[] | []>();
  const [refreshIsLoading, setRefreshIsLoading] = useState<boolean>(false);
  const [isGetting, setIsGetting] = useState<boolean>(false);
  const [onReturn, setReturn] = useState<boolean>(false);
  const [onArchive, setArchive] = useState<boolean>(false);
  const [onMore, setonMore] = useState<boolean>(false);

 const navigate = useNavigate()

  const handleFetchComplianceData = async () => {
    setIsGetting(true);
    try {
      const response = await axios.get("data/compliance-data", {
        params: {
          zipCode: zipCode,
          pushKey: complianceID,
        },
      });
      if (response.status === 200 && response.data) {
        const data = response.data;
        const user = await handleGetUserInfo(data.sender);
        const userList = await handleGetUserList(data.checkedBy);
        const parsedAnswerKey: IndicatorsProps[] = JSON.parse(
          data.fieldAnswers
        );
        const temp = {
          ...data,
          senderInfo: { ...user },
          parsedAnswer: parsedAnswerKey,
          userList: Object.values(userList.data),
        };
        localStorage.setItem(`${data.pushKey}`, JSON.stringify(temp));
        const localData = localStorage.getItem(`${data.pushKey}`);
        const tempData: ComplianceDataProps = JSON.parse(localData as string);

        setData({ ...tempData, parsedAnswer: parsedAnswerKey });
        setIndicatorList(parsedAnswerKey);
        setIsGetting(false);
      } else {
        messageApi.error("Item not found.");
      }
    } catch (error) {
      setIsGetting(false);
      messageApi.error(`Sorry something went wrong: ${error}`);
    } finally {
      setIsGetting(false);
    }
  };

  useEffect(() => {
    handleFetchComplianceData();
  }, []);

  useEffect(() => {
    const localData = localStorage.getItem(`${complianceID}`);
    if (localData) {
      const parsedData: ComplianceDataProps = JSON.parse(localData);
      setData(parsedData);
    }
  }, [complianceID]);

  const handleGetIndicatorStatus = (): number => {
    if (!indicatorList) return 0;
    let indicatorStatusList: IndicatorsProps[] = [];
    const walk = (list: IndicatorsProps[]) => {
      for (const item of Object.values(list)) {
        if (item.status === true) {
          indicatorStatusList?.push(item);
        }
        if (item.subIndicator) {
          walk(item.subIndicator);
        }
      }
    };
    walk(indicatorList as IndicatorsProps[]);
    return indicatorStatusList.length;
  };

  const handleGetIndicatorCount = (): number => {
    if (!indicatorList) return 0;
    let indicatorStatusList: IndicatorsProps[] = [];
    const walk = (list: IndicatorsProps[]) => {
      for (const item of Object.values(list)) {
        if (item.dataInputMethod?.type !== "null") {
          indicatorStatusList?.push(item);
        }
        if (item.subIndicator) {
          walk(item.subIndicator);
        }
      }
    };
    walk(indicatorList as IndicatorsProps[]);
    return indicatorStatusList.length;
  };

  const handleGetFieldNames = async () => {
    try {
      const temp = await handleGetLocal("areaList");
      if (!temp) {
        const response = await axios.get(`/data/audit-fields`);
        if (response.status === 200) {
          const data: AreaProps[] = response.data;

          setAllField(data);
          return;
        } else {
          messageApi.error(`Someting went wrong fetching fields.`);
          return;
        }
      }
      const fieldData: AreaProps[] = JSON.parse(temp as string);
      setAllField(fieldData);
    } catch (error) {
      messageApi.error(``);
    }
  };

  useEffect(() => {
    handleGetFieldNames();
    return () => setAllField([]);
  }, []);

  const {
    data: municipalList,
    isError: townIsError,
    isLoading: townIsLoading,
  } = useQuery({
    queryKey: ["municipalList"],
    queryFn: () => axios.get("/data/municipalities"),
  });

  useEffect(() => {
    if (!municipalList?.data && townIsError) {
      messageApi.error(`Sorry something went wrong ${townIsError}.`);
    }
  }, [townIsError]);

  const handleRefregh = async () => {
    setRefreshIsLoading(true);
    try {
      await handleFetchComplianceData();
      messageApi.success("Refreshed!");
      setRefreshIsLoading(false);
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`);
    } finally {
      setRefreshIsLoading(false);
    }
  };

  const handleReturn = async () => {
    const date = await handleGenerateDate();
    try {
      const response = await axios.post(`/data/return-compliance`, {
        complianceID,
        zipCode,
        date,
      });
      if (response.status === 200) {
        setReturn(false);
        messageApi.success(`Success!`);
      }
    } catch (error) {
      messageApi.error(`Sorry something went wrong`);
    }
  };

  const handleArchived = async () => {
    const date = await handleGenerateDate();
    try {
      const response = await axios.post(`/data/archive-compliance`, {
        complianceID,
        zipCode,
        date,
        data: {...data}
      });
      if (response.status === 200) {
        setArchive(false);
        history.back()
        messageApi.success(`Success!`);
      }
    } catch (error) {
      messageApi.error(`Sorry something went wrong`);
    }
  };

  return (
    <Layout
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
      }}
    >
      {contextMessage}
      {isGetting ? (
        <Layout
          style={{
            width: "100%",
            height: "100%",
            display: "grid",
          }}
        >
          <div style={{ margin: "auto" }}>
            <Spinner size="large" />
          </div>
        </Layout>
      ) : (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            overflowY: "auto",
            padding: "10px",
          }}
        >
          <div
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
            }}
          >
            <div style={{ display: "flex" }}>
              <Typography style={{ width: "150px" }}>Field: </Typography>
              <Typography style={{ width: "100%", fontWeight: "bold" }}>
                {hanldeSearchItem(`${data?.fieldPushKey}`, allField)}
              </Typography>
            </div>
            <div style={{ display: "flex" }}>
              <Typography style={{ width: "150px" }}>Submitted by: </Typography>
              <Typography style={{ width: "100%", fontWeight: "bold" }}>
                {data?.senderInfo.userFullName}
              </Typography>
            </div>
            <div style={{ display: "flex" }}>
              <Typography style={{ width: "150px" }}>Locale: </Typography>
              <Typography style={{ width: "100%", fontWeight: "bold" }}>
                {handleSearchName(
                  data?.zipCode as string,
                  municipalList?.data as LocaleListProps[]
                )}
              </Typography>
            </div>
            <div style={{ display: "flex" }}>
              <Typography style={{ width: "150px" }}>
                Date Submitted:{" "}
              </Typography>
              <Typography style={{ width: "100%", fontWeight: "bold" }}>
                {data?.timestamp}
              </Typography>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Typography style={{ width: "150px" }}>
                Checked Indicators:{" "}
              </Typography>
              <Typography style={{ width: "auto", fontWeight: "bold" }}>
                {`${handleGetIndicatorStatus()}/${handleGetIndicatorCount()}`}
              </Typography>
              <div>
                {handleGetIndicatorStatus() < handleGetIndicatorCount() ? (
                  <Tooltip title="Unreviewed indicators" enterDelay={1}>
                    <>
                      <BsExclamationCircle color="#c1121f" />
                    </>
                  </Tooltip>
                ) : null}
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <Typography style={{ width: "150px" }}>Status: </Typography>
              <Typography style={{ width: "100%", fontWeight: "bold" }}>
                {data?.status === "ongoing"
                  ? "On Review"
                  : data?.status === "done"
                  ? "Done"
                  : ""}
              </Typography>
            </div>

            <div style={{ width: "100%", height: "auto" }}>
              <div>
                <Typography
                  onClick={() => setonMore(!onMore)}
                  style={{ fontWeight: 500, cursor: "pointer", width: "auto" }}
                >
                  {onMore ? "Hide" : "More"}
                </Typography>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "auto",
                  display: onMore ? "block" : "none",
                  padding: "8px",
                }}
              >
                <div style={{ display: "flex", gap: "16px" }}>
                  <Typography>Date Reviewed:</Typography>
                  <Typography style={{ fontWeight: 600 }}>
                    {data?.reviewed || "Not applicable"}
                  </Typography>
                </div>

                <div
                  style={{
                    display:
                      data && data?.userList.length < 1 ? "none" : "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography style={{ width: "120px" }}>
                    Viewed by:
                  </Typography>
                  <GroupAvatars.Group maxCount={10}>
                    {data?.userList &&
                      Object.values(data?.userList).map((item) => (
                        <Tooltip title={item.userFullName}>
                          <>
                            <Avatar size={25} src={item.userProfilePicture} />
                          </>
                        </Tooltip>
                      ))}
                  </GroupAvatars.Group>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
            }}
          >
            <Tooltip enterDelay={1.5} title="Refresh for updates">
              <>
                <Button
                  disabled={data?.status === "done"}
                  onClick={() => setReturn(true)}
                  size="small"
                  style={{ backgroundColor: "" }}
                >
                  {data?.status === "done" ? "Reviewed" : "Mark"}
                </Button>
              </>
            </Tooltip>

            <Tooltip enterDelay={1.5} title="Refresh for updates">
              <>
                <Button
                  loading={refreshIsLoading}
                  onClick={()=> setArchive(true)}
                  size="small"
                >
                 <IoArchiveOutline />
                </Button>
              </>
            </Tooltip>

            <Tooltip enterDelay={1.5} title="Refresh for updates">
              <>
                <Button
                  loading={refreshIsLoading}
                  onClick={handleRefregh}
                  size="small"
                >
                  {!refreshIsLoading && <IoIosRefresh />}
                </Button>
              </>
            </Tooltip>
          </div>
          <div
            style={{
              width: "100%",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {indicatorList &&
              indicatorList.map((item, index) => (
                <IndicatorItem
                disabled={data?.status === "done"}
                  key={index}
                  fieldList={allField as FieldProps[]}
                  setIndicatorList={setIndicatorList}
                  indicatorList={indicatorList}
                  compliancePushKey={data?.pushKey}
                  setDataList={setData}
                  dataList={data}
                  data={item}
                  
                />
              ))}
          </div>
        </div>
      )}
      <Modal
      title="Mark this compliance as 'Reviewed'"
        onFunction={handleReturn}
        children={<ModalReturn />}
        openModal={onReturn}
        setCloseModal={() => setReturn(false)}
      />
      <Modal
      title="Archive this compliance"
        onFunction={handleArchived}
        children={<ModalArchive />}
        openModal={onArchive}
        setCloseModal={() => setArchive(false)}
      />
    </Layout>
  );
};

export default ComplianceData;
