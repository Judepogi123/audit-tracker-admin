import { useEffect, useState } from "react";
import { v4 as genId } from "uuid";
import Layout from "../../../components/Layout";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";

import ModalNewArea from "./ModalNewArea";

import { Typography, message, Row, Col } from "antd";

//controller
import { useQueries, useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../../server/api/axios";

//utils
import { handleGetLocal, handleSaveLocal } from "../../../utils/localStorage";
import { handleGenerateDate } from "../../../provider/CurrentDateProvider";

//interface
import { NewArea, DraftedArea } from "../../../interface/manage";

import { IoAddOutline } from "react-icons/io5";

const NewAreaField = () => {
  const [messageApi, contextMessage] = message.useMessage();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newOnOpen, setOnOpen] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<NewArea | null>(null);
  const [allDraft, setAllDraft] = useState<DraftedArea[] | []>();
  const [isStatus, setIsStatus] = useState<"default" | "failed">("default");

  const { auditID } = useParams();
  const navigate = useNavigate();

  const { data: draftList, isError: draftIsError } = useQuery({
    queryKey: ["draftList"],
    queryFn: () => axios.get("/data/area-draft-list"),
  });

  const handleCacheData = async () => {
    try {
      const string: string = JSON.stringify(draftList?.data as string);
      await handleSaveLocal("draftData", string);
    } catch (error) {
      messageApi.error(`Sorry something went wrong caching drraft: ${error}`);
    }
  };

  useEffect(() => {
    handleCacheData();
  }, [draftList?.data]);

  const handleParsedData = async () => {
    try {
      const temp = await handleGetLocal("draftData");
      const parsedData: DraftedArea[] = JSON.parse(temp as string);
      setAllDraft(parsedData);
    } catch (error) {
      messageApi.error(`Something went wrong: ${error}`);
    }
  };

  useEffect(() => {
    handleParsedData();
    return () => setAllDraft([]);
  }, [draftList?.data]);

  const handleCraeteNewArea = async (values: NewArea) => {
    setIsLoading(true);
    const date = await handleGenerateDate();
    try {
      const newKey = genId();
      const request = await axios.post("/data/new-area", {
        areaKey: newKey,
        auditID: auditID,
        date: date,
        title: values.title,
        description: values.desc,
      });

      if (request.status === 200 && request.data.key) {
        navigate(`/manage/audit/${auditID}/new-area/${request.data.key}`);
        console.log("Success");
      }
    } catch (error) {
      messageApi.error(`Sorry something wenth wrong: ${error}`);
    }
  };

  const handleNavigateNew = (key: string) => {
    try {
      navigate(`/manage/audit/${auditID}/new-area/${key}`);
    } catch (error) {
      messageApi.error(`${error}`);
    }
  };

  const handleCloseNew = () => {
    setOnOpen(false);
  };

  return (
    <Layout style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}>
      {contextMessage}

      <div style={{ width: "100%", height: "10%", padding: "8px" }}>
        <Typography.Title level={3}>Create new area | Drafted</Typography.Title>
      </div>
      <div
        id="gridList"
        style={{ width: "100%", height: "90%", overflowY: "auto" }}
      >
        <div
          style={{
            width: "100%",
            height: "auto",
            display: "grid",
            gridTemplateColumns: "auto auto auto auto auto",
            gridAutoRows: "auto",
            gap: "8px",
            padding: "4px 8px",
          }}
        >
          <div
            onClick={() => setOnOpen(true)}
            style={{
              width: "100%",
              height: "160px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxShadow: `rgba(0, 0, 0, 0.16) 0px 1px 4px`,
              display: "grid",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          >
            <div style={{ margin: "auto" }}>
              <IoAddOutline fontSize={60} />
              <Typography
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                New area
              </Typography>
            </div>
          </div>
          {!allDraft
            ? null
            : allDraft
                .sort(
                  (a, b) =>
                    new Date(b.timestamp).valueOf() -
                    new Date(a.timestamp).valueOf()
                )
                .filter((item) => item.auditKey === auditID)
                .map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleNavigateNew(item.areaKey)}
                    style={{
                      width: "100%",
                      height: "160px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      boxShadow: `rgba(0, 0, 0, 0.16) 0px 1px 4px`,
                      display: "flex",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                      justifyContent: "space-between",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{ width: "100%", height: "auto", padding: "8px" }}
                    >
                      <Typography.Paragraph
                        ellipsis={{
                          rows: 2
                        }}
                        style={{
                          fontSize: "1rem",
                          fontWeight: 600,
                          textAlign: "justify",
                        }}
                        
                      >
                        {item.title}
                      </Typography.Paragraph>
                    </div>
                    <div style={{ padding: "12px" }}>
                      <Typography
                        style={{ fontSize: ".8rem", fontWeight: 500 }}
                      >
                        Last saved: {item.timestamp || "No Date found"}
                      </Typography>
                    </div>
                  </div>
                ))}
        </div>
      </div>

      <Modal
        cancelHid={true}
        okHid={true}
        title="New area"
        width={600}
        children={
          <ModalNewArea
            handleCraeteNewArea={handleCraeteNewArea}
            handleCloseNew={handleCloseNew}
            formValue={formValue}
            setFormValue={setFormValue}
          />
        }
        openModal={newOnOpen}
        setCloseModal={handleCloseNew}
      />
    </Layout>
  );
};

export default NewAreaField;
