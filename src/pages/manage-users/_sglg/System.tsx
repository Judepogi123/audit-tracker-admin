import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../../server/api/axios";

import { useSystemData } from "../../../provider/SystemDataProvider";

import "./style.scss";
import { Layout, Typography, Divider, Skeleton } from "antd";

import { FaRegEdit } from "react-icons/fa";

import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import TitleUpdate from "./update/TitleUpdate";

interface IndicatorsProps {
  dataInputMethod: { trpe: string; value: number };
  descriptions: string;
  id: string;
  mov: string;
  movDueDate: string | undefined | "null";
  title: string;
  type: string;
}

interface FieldProps {
  id: string;
  title: string;
  type: string;
  dependencies: { method: string; value: number };
  requirements: { requiredId: string[]; condition: string };
  indicators: IndicatorsProps[];
}

interface SystemDataProps {
  auditAcronym: string;
  auditFullname: string;
  fieldTitle: string;
  revisionNumber: number;
  fields: FieldProps[];
}

const System = () => {
  const [editOnOpen, setEditOnOpen] = useState<boolean>(false);
  const [systemData, setSystemData] = useState<SystemDataProps | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const systemDatas = useSystemData();

  const handleOpenTitleEditModal = () => {
    setEditOnOpen(true);
  };

  const handleGetSystemData = async () => {
    setIsLoading(true);
    try {
      const request = await axios.get("/system/data");
      if (request.data) {
        setSystemData(request.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetSystemData();
    return () => setSystemData(undefined);
  }, []);

  const handleNavigate = (value: string) => {
    navigate(value);
  };

  return (
    <Layout
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fffcf2"

      }}
    >
      {isLoading ? (
        <Skeleton />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "auto",
          }}
        >
          <div
            style={{
              width: "auto",
              display: "flex",
              alignItems: "center",
              padding: "10px",
              gap: "10px",
            }}
          >
            <Typography.Text
              className="system-title"
              style={{ fontWeight: "bold" }}
            >
              {systemData?.auditFullname}
            </Typography.Text>
            <Typography.Text className="system-title">
              ({systemData?.auditAcronym})
            </Typography.Text>
            <div
              className="system-title-edit"
              onClick={handleOpenTitleEditModal}
            >
              <FaRegEdit fontSize={25} />
            </div>
          </div>

          <div className="system-content">
            <div className="system-field-title">
              <Typography.Text
                style={{ fontWeight: "normal", fontSize: "1rem" }}
              >
                {systemData?.fieldTitle}
              </Typography.Text>
              <Button
                onClick={() => navigate("/manage/update-audit")}
                icon={<FaRegEdit />}
                type="primary"
                style={{ backgroundColor: "#00b4d8" }}
              >
                Update
              </Button>
            </div>
            <div className="system-field-item"></div>
          </div>
        </div>
      )}

      <Modal
        title="Update Program Title"
        children={<TitleUpdate placeholder={`${systemData?.auditFullname}`} />}
        openModal={editOnOpen}
        setCloseModal={() => setEditOnOpen(false)}
      />
    </Layout>
  );
};

export default System;
