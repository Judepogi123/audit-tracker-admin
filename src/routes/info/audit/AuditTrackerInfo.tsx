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
import { convertToArrays } from "../../../pages/manage-users/_sglg/update/_functions";

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
  marked: boolean;
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
  timestamp: string;
}

interface HoverIDProps {
  id: string | null;
}

const AuditTrackerInfo = () => {
  const [currentField, setCurrrentField] = useState<FieldProps | null>(null);
  const [hoverID, setHoverID] = useState<HoverIDProps | undefined>(undefined);
  const [archiveField, setArchiveField] = useState<boolean>(false);
  const [onUpdate, setOnUpdate] = useState<boolean>(false);
  const [archiveFieldLoading, setArchiveFieldLoading] =
    useState<boolean>(false);
  const [archiveFieldStatus, setArchiveFieldStatus] = useState<{
    message: string;
    status: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const { auditID, fieldID } = useParams();

  const navigate = useNavigate();

  console.log(currentField);

  const handleHoverEnter = (
    id: string,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const currentTarget = event.currentTarget as HTMLDivElement; // Explicitly type currentTarget

    if (!currentTarget.contains(event.relatedTarget as Node)) {
      setHoverID({ id });
    }
  };

  const handleGetCurrentField = async () => {
    setIsLoading(true);
    try {
      const request = await axios.get(`/data/field-info`, {
        params: {
          pushKey: fieldID,
        },
      });
      if (request.data) {
        setCurrrentField(request.data);
        setIsLoading(false);
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
      setArchiveField(false);
      if (archiveFieldStatus?.status === "success") {
        setArchiveField(false);
      }
    } catch (error) {
      messageApi.error(`${error}`);
    }
  };

  const handleUpdate = () => {
    setOnUpdate(false);
  };

  const handelSaveUpdate = async () => {
    try {
      const dataCopy = { ...currentField };
      const indicators = convertToArrays(
        dataCopy?.indicators as IndicatorsProps[]
      );

      if (!currentField) return;

      const response = await axios.post("/data/new-area", {
        areaKey: currentField.pushKey,
        auditID: auditID,
        date: currentField?.timestamp,
        title: currentField?.title,
        description: currentField?.description,
        draftedField: { ...currentField, indicators: indicators },
      });
      if (response.status === 200) {
        navigate(`/manage/audit/${auditID}/new-area/${fieldID}`);
      } else {
        messageApi.error(`Sorry something navigating page.`);
      }
    } catch (error) {
      console.log(error);
      messageApi.error(`Sorry something went wrong: ${error}`);
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
            <Typography.Title level={4}>{currentField?.title}</Typography.Title>
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

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              padding: "4px 8px",
            }}
          >
            {currentField?.indicators &&
              Object.values(currentField.indicators).map((indicator, index) => (
                <div
                  key={indicator.key}
                  style={{
                    cursor: "pointer",
                    border:
                      hoverID?.id === indicator.key ? "1px solid #ccc" : "",
                    borderRadius: "5px",
                  }}
                >
                  <div>
                    <div
                      style={{ width: "100%", height: "auto", padding: "8px" }}
                    >
                      <Typography.Paragraph
                        style={{
                          color: hoverID?.id === indicator.key ? "#c1121f" : "",
                        }}
                      >
                        {index + 1}. {indicator.query}
                      </Typography.Paragraph>
                    </div>
                    {indicator.dataInputMethod.type === "null" ? (
                      <Typography
                        style={{ fontWeight: 300, fontSize: ".8rem" }}
                      >
                        (Data input not applicable)
                      </Typography>
                    ) : (
                      <IndicatorValue
                        type={indicator.dataInputMethod.type as string}
                        value={indicator.dataInputMethod.value}
                      />
                    )}
                  </div>

                  <div>
                    {indicator.subIndicator &&
                      Object.values(indicator.subIndicator).map(
                        (item, subIndex) => (
                          <div
                            style={{
                              width: "100%",
                              height: "auto",
                              padding: "0px 20px",
                              border:
                                hoverID?.id === item.key
                                  ? "1px solid #ccc"
                                  : "",
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
                                  {index + 1}.{subIndex + 1} {item.query}
                                </Typography>
                                {item.dataInputMethod.type === "null" ? (
                                  <Typography
                                    style={{
                                      fontWeight: 300,
                                      fontSize: ".8rem",
                                    }}
                                  >
                                    (Data input not applicable)
                                  </Typography>
                                ) : (
                                  <IndicatorValue
                                    type={item.dataInputMethod.type as string}
                                    value={item.dataInputMethod.value}
                                  />
                                )}
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
                                Object.values(item.subIndicator).map(
                                  (sub, subSubIndex) => (
                                    <div
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
                                            {index + 1}.{subIndex + 1}.
                                            {subSubIndex + 1} {sub.query}
                                          </Typography>
                                          {sub.dataInputMethod.type ===
                                          "null" ? (
                                            <Typography
                                              style={{
                                                fontWeight: 300,
                                                fontSize: ".8rem",
                                              }}
                                            >
                                              (Data input not applicable)
                                            </Typography>
                                          ) : (
                                            <IndicatorValue
                                              type={
                                                sub.dataInputMethod
                                                  .type as string
                                              }
                                              value={sub.dataInputMethod.value}
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                            </div>
                          </div>
                        )
                      )}
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
            <div style={{ display: "flex", gap: "8px" }}>
              <Button onClick={() => setOnUpdate(true)}>Update</Button>
            </div>
          </div>
        </>
      )}
      <Modal
        onFunction={handelSaveUpdate}
        title={`Update ${currentField?.title}?`}
        width={500}
        children={""}
        openModal={onUpdate}
        setCloseModal={handleUpdate}
      />
    </Layout>
  );
};

export default AuditTrackerInfo;

const IndicatorValue = ({ value, type }: { value: string; type: string }) => {
  if (!value) return;

  if (type === "check_box" || type === "radio_button") {
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
        {Object.values(temp).map((item, index) => (
          <Typography key={index}>{item.title}</Typography>
        ))}
      </div>
    );
  }
  if (type === "str" || type.includes("num") || type === "date") {
    return (
      <Typography>
        {type === "str" ? `Take text as response` : type === "num"}
      </Typography>
    );
  }
};
