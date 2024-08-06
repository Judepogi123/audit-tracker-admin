import { useEffect, useState } from "react";

//controller
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../../server/api/axios";

//ui
import { Typography, message } from "antd";
import Layout from "../../../components/Layout";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import Spinner from "../../../components/Spinner";

//icons
import { GoDotFill } from "react-icons/go";

//utils
import { convertToArrays } from "../../../pages/manage-users/_sglg/update/_functions";

interface RequirementsProps {
  condition: string;
  value: { id: string; query: string; status: boolean }[];
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


const AuditTrackerInfo = () => {
  const [currentField, setCurrrentField] = useState<FieldProps | null>(null);
  const [onUpdate, setOnUpdate] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const { auditID, fieldID } = useParams();

  const navigate = useNavigate();

  console.log(currentField);
  

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
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        overflow: "auto",
      }}
    >
      {contextHolder}
      {isLoading ? (
        <Layout style={{width:"100%", height: "100%", display: "grid"}}>
          <div style={{margin: "auto"}}><Spinner size="large"/></div>
        </Layout>
      ) : (
        <>
          <div
            style={{
              width: "100%",
              height: "auto",
              display: "flex",
              padding: "8px",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Typography.Title level={4}>{currentField?.title}</Typography.Title>
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
                    borderRadius: "5px",
                  }}
                >
                  <div>
                    <div
                      style={{ width: "100%", height: "auto", padding: "8px" }}
                    >
                      <Typography.Paragraph
                        style={{
                          fontWeight: 600,
                          fontSize: "1.1rem"
                        }}
                      >
                        {index + 1}. {indicator.query}
                      </Typography.Paragraph>
                      <Typography
                        style={{ fontStyle: "italic", fontWeight: 400 }}
                      >
                        {indicator.mov === "null"
                          ? "This indicator does not support MOV"
                          : ""}
                      </Typography>
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

                  <div style={{width: "100%", height: "auto", display: "flex", flexDirection: "column", gap: "4px"}}>
                    {indicator.subIndicator &&
                      Object.values(indicator.subIndicator).map(
                        (item, subIndex) => (
                          <div
                          key={subIndex}
                            style={{
                              width: "100%",
                              height: "auto",
                              padding: "0px 20px",
                              borderRadius: "5px",
                            }}
                          >
                            <div>
                              <div>
                                <Typography
                                  style={{
                                    fontWeight: 600,
                                    fontSize: "1.1rem"
                                  }}
                                >
                                  {index + 1}.{subIndex + 1} {item.query}
                                </Typography>
                                {item.dataInputMethod.type === "null" && (
                                  <Typography
                                    style={{
                                      fontStyle: "italic",
                                      fontWeight: 400,
                                    }}
                                  >
                                    {indicator.mov === "null"
                                      ? "This indicator does not support MOV"
                                      : ""}
                                  </Typography>
                                )}
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
                                gap: "4px"
                              }}
                            >
                              {item.subIndicator &&
                                Object.values(item.subIndicator).map(
                                  (sub, subSubIndex) => (
                                    <div
                                    key={subSubIndex}
                                      style={{
                                        width: "100%",
                                        height: "auto",
                                        padding: "0px 20px",
                                        display: "flex",
                                        flexDirection: "column",
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
                                              fontWeight: 600,
                                              fontSize: "1.1rem"
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
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "flex-end",
                padding: "8px",
              }}
            >
              <Button onClick={() => setOnUpdate(true)} style={{backgroundColor: "#1982c4",color: "#fff"}}>Update</Button>
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
          <Typography key={index} style={{display: "flex", gap: "8px", alignItems: "center"}}><GoDotFill/>{item.title}</Typography>
        ))}
      </div>
    );
  }
  if (type === "str" || type.includes("num") || type === "date") {
    return (
      <Typography>
        {type === "str" ? `Take text as response` : type.includes("num")? `Take numbers as response` : `Take date as response`}
      </Typography> 
    );
  }
};
