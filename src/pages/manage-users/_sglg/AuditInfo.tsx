import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import Button from "../../../components/Button";
import Spinner from "../../../components/Spinner";
import Popover from "../../../components/Popover";
import Tooltip from "../../../components/Tooltip";
import Modal from "../../../components/Modal";
import { Typography, message } from "antd";

import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../../server/api/axios";
import { useUserData } from "../../../provider/DataProvider";


import { IoIosAdd } from "react-icons/io";
import { FaEllipsisVertical } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";

import { handleGetLocal, handleSaveLocal } from "../../../utils/localStorage";
import { handleGenerateDate } from "../../../provider/CurrentDateProvider";

import ModalArchiveArea from "./ModalArchiveArea";
import ModalLockArea from "./ModalLockArea";

import {
  AuditProps,
  AreaProps,
  PermissionsProps,
} from "../../../interface/manage";


import "./style.scss";

const AuditInfo = () => {
  const [messageApi, contextMessage] = message.useMessage();
  const [areaList, setAreaList] = useState<AreaProps[] | []>([]);
  const [selectedArea, setSelectedArea] = useState<AreaProps | undefined>(
    undefined
  );
  const [archive, setAchive] = useState<boolean>(false);
  const [lock, setLock] = useState<boolean>(false);
  const [archiveIsLoading, setAchiveIsLoading] = useState<boolean>(false);
  const [permission, setPermission] = useState<
    PermissionsProps | string | null
  >(null);

  const navigate = useNavigate();
  const user = useUserData();

  useEffect(() => {
    const handleUserPersmission = () => {
      try {
        const temp: PermissionsProps =
          user.userPermission === "all"
            ? "all"
            : JSON.parse(user.userPermission);
        setPermission(temp);
      } catch (error) {
        messageApi.error(`Something went wrong with user permission`);
      }
    };

    handleUserPersmission();
    return () => setPermission(null);
  }, [user]);

  const { auditID } = useParams();

  const {
    data: areas,
    isError: areasIsError,
    isLoading: areasIsLoading,
    refetch,
  } = useQuery({
    queryKey: ["areas"],
    queryFn: () => axios.get("/data/areas"),
  });
  

  const { data: auditInfo, isError: auditIsLoading } = useQuery({
    queryKey: ["auditInfo"],
    queryFn: () => axios.get("/data/audit-info", { params: { auditID } }),
  });
  

  const handleCacheData = async () => {
    if (areasIsError) {
      messageApi.error(`Something went wrong wtih caching.`);
      return;
    }
    try {
      const data = JSON.stringify(areas?.data);
      await handleSaveLocal("areaList", data);
    } catch (error) {
      messageApi.error(`Something went wrong wtih caching: ${error}`);
    }
  };

  useEffect(() => {
    handleCacheData();
  }, [areas?.data]);

  const handleGetParsedData = async () => {
    try {
      const cache = await handleGetLocal("areaList");
      if (!cache) {
        setAreaList([]);
        return;
      }
      const parsed: AreaProps[] = JSON.parse(cache as string);
      setAreaList(parsed);
    } catch (error) {
      messageApi.error(`Something went wrong wtih parsing: ${error}`);
    }
  };

  useEffect(() => {
    handleGetParsedData();
  }, [areas?.data]);

  const handleSelectIndicator = async (id: string) => {
    try {
      navigate(`/manage/audit-info/${auditID}/area/${id}`);
    } catch (error) {
      messageApi.error(`Something went wrong wtih navigating: ${error}`);
    }
  };

  const hanldeAchiveSelected = (data: AreaProps, type:string) => {
    if (
      permission &&
      typeof permission === "object" &&
      "audit" in permission
    ) {
      if (
        permission.audit === "auditR" ||
        user.userPermission === "all"
      ) {
        messageApi.warning(
          `Current user is not authorized for this action!`
        );
        return;
      }
    }
    try {
      if(type === "archive"){
        setAchive(true);
      }else{
        setLock(true)
      }
      setSelectedArea(data);
      
    } catch (error) {
      messageApi.error(`Sorry something went wrong.`);
    }
  };

  const handleCancel = (type: string) => {
    if (type === "archive") {
      setAchive(false);
    } else {
      setLock(false);
    }

    setSelectedArea(undefined);
  };

  const hanldeArchiveArea = async (type: string) => {
    if (!selectedArea || selectedArea === undefined) {
      messageApi.error(`Sorry something went wrong archiving this area`);
      return;
    }
    setAchiveIsLoading(true);
    const date = await handleGenerateDate()
    try {
      const link = type === "archive" ? "archive" : "lock"
      const request = await axios.post(`/data/${link}-area`, {
        pushKey: selectedArea.pushKey,
        status: selectedArea.locked,
        date
      });
      if (request.status === 200) {
       setAchiveIsLoading(false);
        refetch();
        type === "archive" ?  setAchive(false): setLock(false);
        messageApi.success(`Success!`);
      } else {
        messageApi.error(`Failed.`);
      }
    } catch (error) {
      messageApi.error(`Sorry something went wrong archiving this area`);
    } finally {
      setAchiveIsLoading(false);
    }
  };

  const handleOpenOption = (data: AreaProps | undefined)=>{
    if(selectedArea?.pushKey === data?.pushKey){
      setSelectedArea(undefined)
    }
    setSelectedArea(data)
  }

  // if(areasIsLoading || auditIsLoading){
  //   return (
  //     <Layout style={{width: "100%", height: "100%", display: "grid"}}>
  //       <div style={{margin: "auto"}}>
  //         <Spinner size="large"/>
  //       </div>
  //     </Layout>
  //   )
  // }

  return (
    <Layout style={{ width: "100%", height: "100%" }}>
      {contextMessage}
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleOpenOption(undefined);
        }}
        style={{
          width: "100%",
          height: "10%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px",
        }}
      >
        <Typography style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
          {auditInfo?.data.title}
        </Typography>
        <Button
          onClick={() => {
            if (
              permission &&
              typeof permission === "object" &&
              "compliance" in permission
            ) {
              if (
                permission.compliance === "complianceR" ||
                user.userPermission === "all"
              ) {
                messageApi.warning(
                  `Current user is not authorized for this action!`
                );
                return;
              }
            }
            navigate(`/manage/audit/${auditID}/new-area`);
          }}
          style={{
            backgroundColor: "#4096ff",
            color: "#fff",
            marginRight: "8px",
            display: "flex",
          }}
        >
          <IoIosAdd fontSize={24} /> Add
        </Button>
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleOpenOption(undefined);
        }}
        id="list"
        style={{
          width: "100%",
          height: "90%",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          padding: "4px 8px",
        }}
      >
        {areaList.filter(
          (item) => item.auditKey === auditID && item.archived === false
        ).length < 1 ? (
          <div style={{ width: "100%", height: "100%", display: "grid" }}>
            <Typography
              style={{ fontSize: "1.2rem", fontWeight: 700, margin: "auto" }}
            >
              No area/s found in this audit.
            </Typography>
          </div>
        ) : (
          areaList
            .filter(
              (item) => item.auditKey === auditID && item.archived === false
            )
            .map((item, index) => (
              <div
                className="auditItem"
                onClick={() => handleSelectIndicator(item.pushKey)}
                key={index}
                style={{
                  width: "100%",
                  padding: "16px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: "pointer",
                  backgroundColor: "#fff",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textAlign: "justify",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <div style={{ padding: "0xp 8px", marginLeft: "8px" }}>
                    <Tooltip
                      enterDelay={1}
                      title={item.locked ? "This area is look" : ""}
                    >
                      <>{item.locked ? <FaLock /> : <FaLockOpen />}</>
                    </Tooltip>
                  </div>
                  <Typography style={{ fontWeight: 600, fontSize: "1rem" }}>
                    {item.title}
                  </Typography>
                </div>

                <div
                  style={{
                    padding: "2px",
                    borderRadius: "50%",

                    zIndex: 200,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenOption({...item});
                  }}
                >
                  <Popover
                    style={{ zIndex: 1000 }}
                    trigger="click"
                    open={item.pushKey === selectedArea?.pushKey}
                    placement="bottomLeft"
                    content={
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          onClick={() => hanldeAchiveSelected({ ...item }, "archive")}
                          style={{
                            padding: "4px 8px",
                            textAlign: "left",
                            cursor: "pointer",
                          }}
                        >
                          Archive
                        </div>
                        <div
                         onClick={() => hanldeAchiveSelected({ ...item }, "lock")}
                          style={{
                            padding: "4px 8px",
                            textAlign: "left",
                            cursor: "pointer",
                          }}
                        >
                          {item.locked ? "Unlock" : "Lock"}
                        </div>
                      </div>
                    }
                  >
                    <FaEllipsisVertical fontSize={20} />
                  </Popover>
                </div>
              </div>
            ))
        )}
      </div>
      <Modal
        loading={archiveIsLoading}
        onFunction={()=> hanldeArchiveArea("lock")}
        title={selectedArea && selectedArea.title}
        children={<ModalLockArea />}
        openModal={lock}
        setCloseModal={()=> handleCancel("lock")}
      />
      <Modal
        loading={archiveIsLoading}
        onFunction={()=> hanldeArchiveArea("archive")}
        title={selectedArea && selectedArea.title}
        children={<ModalArchiveArea />}
        openModal={archive}
        setCloseModal={()=> handleCancel("archive")}
      />
    </Layout>
  );
};

export default AuditInfo;
