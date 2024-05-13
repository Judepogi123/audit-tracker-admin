import { useState, useId, useEffect } from "react";
import { v4 as genId } from "uuid";
import Layout from "../../../components/Layout";
import Button from "../../../components/Button";
import Spinner from "../../../components/Spinner";

import "./style.scss";

import { message } from "antd";

import { useNavigate, useParams } from "react-router-dom";

import { Typography, Table, TableProps } from "antd";
import { FaChevronCircleRight } from "react-icons/fa";

import { useQuery } from "@tanstack/react-query";
import axios from "../../../../server/api/axios";

import { handleGetLocal, handleSaveLocal } from "../../../utils/localStorage";

import { NewAudit, AuditProps } from "../../../interface/manage";

import { useUserData } from "../../../provider/DataProvider";

import { PermissionsProps } from "../../../interface/manage";

const Audits = () => {
  const [messageApi, contextMessage] = message.useMessage();
  const [auditList, setAuditList] = useState<AuditProps[] | []>([]);
  const [permission, setPermission] = useState<PermissionsProps>();
  const { newAuditID } = useParams();
  const navigate = useNavigate();

  const user = useUserData();

  const handleExtractPermission = () => {
    try {
      // if (user.userPermission === "all") {
      //   setPermission("all");
      //   return
      // }

      const temp: PermissionsProps = user.userPermission === "all"? "all" : JSON.parse(user.userPermission);
      setPermission(temp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleExtractPermission();
  }, [user]);

  const {
    data: fetchedAuditList,
    isError: auditIsError,
    isLoading: auditIsLoading,
  } = useQuery({
    queryKey: ["auditList"],
    queryFn: () => axios.get("/data/field-list"),
  });

  const handleNewAudit = () => {
    if (permission?.audit === "auditR" || user.userPermission !== "all") {
      messageApi.warning(`Current user is not authorized for this action!`);
      return;
    }
    try {
      const auditID = genId();
      navigate(`/manage/new-audit/${auditID}`);
    } catch (error) {
      messageApi.error(`Navigation error: ${error}`);
    }
  };

  const handleCacheData = async () => {
    try {
      const stringtemp: string = JSON.stringify(
        fetchedAuditList?.data as string
      );
      await handleSaveLocal("allAuditList", stringtemp);
    } catch (error) {
      messageApi.error(
        `Sorry something went wrong with caching data: ${error}`
      );
    }
  };

  useEffect(() => {
    handleCacheData();
  }, [fetchedAuditList?.data]);

  const handleGetCacheData = async () => {
    try {
      const cache = await handleGetLocal("allAuditList");
      if (!cache) {
        setAuditList([]);
        return;
      }
      const parsed: AuditProps[] = JSON.parse(cache as string);
      setAuditList(parsed);
    } catch (error) {
      messageApi.error(
        `Sorry something went wrong with parsing data: ${error}`
      );
    }
  };

  useEffect(() => {
    handleGetCacheData();
  }, [fetchedAuditList?.data]);

  const handleNavigateAudit = (key: string) => {
    try {
      navigate(`/manage/audit/${key}`);
    } catch (error) {
      messageApi.error(`Sorry something went wrong navigating: ${error}`);
    }
  };

  return (
    <Layout style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}>
      {contextMessage}
      <div
        style={{
          width: "100%",
          height: "10%",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "0px 16px",
        }}
      >
        <Button style={{backgroundColor: "#1982c4", color: "#fff"}} onClick={handleNewAudit}>New Audit</Button>
      </div>
      <div
        id="auditList"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          padding: "4px 8px",
          width: "100%",
          height: "100%",
          overflowX: "hidden",
        }}
      >
        {auditIsLoading ? (
          <div style={{ width: "100%", height: "100%", display: "grid" }}>
            {" "}
            <div style={{ margin: "auto" }}>
              <Spinner size="large" />
            </div>{" "}
          </div>
        ) : auditList.length <= 0 ? (
          <div style={{ width: "100%", height: "100%" }}>Emty</div>
        ) : (
          // <Table pagination={false} columns={column} dataSource={auditList}/>
          auditList.map((item) => (
            <div
              key={item.key}
              onClick={() => handleNavigateAudit(item.key)}
              id="auditItem"
              style={{
                width: "100%",
                height: "auto",
                padding: "16px",
                display: "flex",
                justifyContent: "space-between",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
                backgroundColor: "#fff"
              }}
            >
              <div style={{ display: "flex", gap: "8px" }}>
                <Typography style={{ fontWeight: "bolder" }}>
                  {item.acronym}
                </Typography>
                |<Typography>{item.title}</Typography>
                <Typography >
                  {item.type === "municipal" ? "Municipal" : "Barangay"}
                </Typography>
              </div>

              <div>
                <FaChevronCircleRight fontSize={25} color="#adb5bd" />
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default Audits;
