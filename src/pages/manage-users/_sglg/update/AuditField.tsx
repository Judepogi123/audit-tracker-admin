import React, { useState, useEffect } from "react";

import axios from "../../../../../server/api/axios";
import { useNavigate } from "react-router-dom";

import { IoMdAdd } from "react-icons/io";

import { Layout, Typography, Skeleton } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";

import { useSystemData } from "../../../../provider/SystemDataProvider";

import "./style.scss";

type MovType = "any" | "pdf" | "doc" | "excel";

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
const AuditField = () => {
  const [fields, setFields] = useState<FieldProps[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const systemData = useSystemData();
  const navigate = useNavigate();

  const handleGetFields = async () => {
    setIsLoading(true);
    try {
      const request = await axios.get("/data/audit-fields");
      if (request.data) {
        setFields(request.data);
        console.log(request.data);
      } else {
        setFields(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetFields();
    return () => setFields(null);
  }, []);

  const handleAddField = () => {
    // const newField: FieldProps{
    // }
  };

  const handleNavigateField = (id: string) => {
    navigate(`/manage/audit-info/${id}`);
  };

  const handleIndicatorPath = ()=>{
    
  }

  return (
    <Layout
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="audit-field-header">
        <div>
          <Typography.Text style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            {systemData.systemDatas.fieldTitle}
          </Typography.Text>
        </div>
        <div>
          <Button
            onClick={() => navigate("/manage/update-audit/new-field")}
            icon={<PlusOutlined />}
            type="primary"
            style={{ backgroundColor: "#00b4d8" }}
          >
            Add
          </Button>
        </div>
      </div>

      <div
        style={{ gap: "5px", padding: "5px 10px" }}
        className="audit-field-content"
      >
        {isLoading ? (
          <Skeleton paragraph={{ rows: 5 }} />
        ) : fields === null ? (
          <div style={{ width: "100%", height: "auto", display: "grid" }}>
            <Typography.Text style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              Add fields
            </Typography.Text>
          </div>
        ) : (
          Array.isArray(fields) &&
          fields.map((item, index) => (
            <div
              onClick={() => handleNavigateField(item.pushKey)}
              key={item.pushKey}
              style={{
                width: "100%",
                height: "auto",
                display: "flex",
                flexDirection: "column",
                padding: "5px 10px",
                cursor: "pointer",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <div style={{display: "flex", alignItems: "center"}}>
                <Typography.Title level={5}>{item.title}</Typography.Title>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default AuditField;
