import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../../server/api/axios";

import { Typography, Skeleton, message } from "antd";
import Layout from "../../../components/Layout";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import Rsults from "../../../components/Rsults";
import { EditOutlined } from "@ant-design/icons";

import ArchiveField from "./ArchiveField";

import { handleArchiveField } from "./_server/_handleArchive";
import { formattedDate } from "../../../provider/DateProvider";

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
    value: string;
  };
  query: string;
  key: string;
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

interface HoverIDProps {
  id: string | null;
}

const AuditTrackerInfo = () => {
  const [currentField, setCurrrentField] = useState<FieldProps | null>(null);
  const [hoverID, setHoverID] = useState<HoverIDProps | undefined>(undefined);
  const [archiveField, setArchiveField] = useState<boolean>(false);
  const [archiveFieldLoading, setArchiveFieldLoading] =
    useState<boolean>(false);
  const [archiveFieldStatus, setArchiveFieldStatus] = useState<{
    message: string;
    status: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const { fieldID } = useParams();

  const navigate = useNavigate();

  const handleHoverEnter = (
    id: string,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const currentTarget = event.currentTarget as HTMLDivElement; // Explicitly type currentTarget

    if (!currentTarget.contains(event.relatedTarget as Node)) {
      setHoverID({ id });
    }
  };

  const handleHoverLeave = () => {
    setHoverID({ id: null });
  };

  const handleGetCurrentField = async () => {
    setIsLoading(true);
    try {
      const request = await axios.get(`/data/field-info`, {
        params: {
          id: fieldID,
        },
      });
      if (request.data) {
        setCurrrentField(request.data);
        setIsLoading(false);
        console.log(request.data);
      }
    } catch (error) {
      console.log("Jude eerror", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetCurrentField();
    return () => setCurrrentField(null);
  }, []);

  const handleFieldArchive = async () => {
    if (fieldID === undefined) return;

    setArchiveFieldLoading(true);
    try {
      await handleArchiveField(fieldID, setArchiveFieldStatus, formattedDate);
      setArchiveField(false)
      if (archiveFieldStatus?.status === "success") {
        setArchiveField(false);
      }
    } catch (error) {
      messageApi.error(`${error}`);
    }
  };

  return (
    <Layout
      onMouseEnter={() => setHoverID({ id: null })}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        overflow: "auto",
      }}
    >
      {archiveFieldStatus?.status === "success" && (
        <Rsults
          status={archiveFieldStatus.status}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            margin: "auto",
            width: "600px",
            height: "400px",
            backgroundColor: "#fff",
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            borderRadius: "5px",
            textAlign: "center",
            lineHeight: "100px",
          }}
          title={`${archiveFieldStatus.message}`}
          extra={[
            <Button onClick={() => navigate("/manage/update-audit")}>
              Back to the field list
            </Button>,
          ]}
        />
      )}
      {contextHolder}
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <div
            style={{
              width: "100%",
              height: "auto",
              display: "flex",
              padding: "5px",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Typography.Title level={4}>
              {currentField?.title} {hoverID?.id}
            </Typography.Title>
            <div style={{ padding: "5px" }}>
              <EditOutlined style={{ fontSize: "1.2rem", cursor: "pointer" }} />
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: "auto",
              display: "flex",
              padding: "5px 10px",
            }}
          >
            <Typography.Paragraph>
              {currentField?.description}
            </Typography.Paragraph>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {currentField?.indicators &&
              Object.values(currentField.indicators).map((indicator) => (
                <div
                  key={indicator.key}
                  onMouseEnter={(event) =>
                    handleHoverEnter(indicator.key, event)
                  }
                  onMouseLeave={handleHoverLeave}
                  style={{
                    cursor: "pointer",
                    border:
                      hoverID?.id === indicator.key ? "1px solid #ccc" : "",
                    borderRadius: "5px",
                  }}
                >
                  <div>
                    <div
                      style={{ width: "100%", height: "auto", padding: "10px" }}
                    >
                      <Typography.Title
                        level={5}
                        style={{
                          color: hoverID?.id === indicator.key ? "#c1121f" : "",
                        }}
                      >
                        {indicator.query}
                      </Typography.Title>
                    </div>
                    <IndicatorValue value={indicator.dataInputMethod.value} />
                  </div>

                  <div>
                    {indicator.subIndicator &&
                      Object.values(indicator.subIndicator).map((item) => (
                        <div
                          onMouseEnter={(event) =>
                            handleHoverEnter(item.key, event)
                          }
                          onMouseLeave={handleHoverLeave}
                          style={{
                            width: "100%",
                            height: "auto",
                            padding: "0px 20px",
                            border:
                              hoverID?.id === item.key ? "1px solid #ccc" : "",
                            borderRadius: "5px",
                          }}
                        >
                          <div>
                            <div>
                              <Typography
                                style={{
                                  color:
                                    hoverID?.id === item.key ? "#c1121f" : "",
                                }}
                              >
                                {item.query}
                              </Typography>
                              <IndicatorValue
                                value={item.dataInputMethod.value}
                              />
                            </div>
                          </div>

                          <div
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            {item.subIndicator &&
                              Object.values(item.subIndicator).map((sub) => (
                                <div
                                  onMouseEnter={(event) =>
                                    handleHoverEnter(sub.key, event)
                                  }
                                  onMouseLeave={handleHoverLeave}
                                  style={{
                                    width: "100%",
                                    height: "auto",
                                    padding: "0px 20px",
                                    display: "flex",
                                    flexDirection: "column",
                                    border:
                                      hoverID?.id === sub.key
                                        ? "1px solid #ccc"
                                        : "",
                                    borderRadius: "5px",
                                  }}
                                >
                                  <div>
                                    <div
                                      style={{
                                        width: "100%",
                                        height: "auto",
                                        padding: "0px 20px",
                                      }}
                                    >
                                      <Typography
                                        style={{
                                          color:
                                            hoverID?.id === sub.key
                                              ? "#c1121f"
                                              : "",
                                        }}
                                      >
                                        {sub.query}
                                      </Typography>
                                      <IndicatorValue
                                        value={sub.dataInputMethod.value}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
          <div
            style={{
              width: "100%",
              height: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{ width: "100%", height: "auto", display: "grid" }}
            ></div>
            <div>
              <Button onClick={() => setArchiveField(true)}>
                Archive field
              </Button>
            </div>
          </div>
          <Modal
          width={400}
          loading={archiveFieldLoading}
            onFunction={handleFieldArchive}
            children={<ArchiveField  dataID={fieldID} />}
            openModal={archiveField}
            setCloseModal={() => setArchiveField(false)}
          />
        </>
      )}
    </Layout>
  );
};

export default AuditTrackerInfo;

const IndicatorValue = ({ value }: { value: string }) => {
  if (!value) return;
  const temp: { title: string; key: string }[] = JSON.parse(value);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        padding: "5px 20px",
      }}
    >
      {Object.values(temp).map((item) => (
        <Typography>{item.title}</Typography>
      ))}
    </div>
  );
};
