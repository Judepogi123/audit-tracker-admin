import { useEffect, useState } from "react";
import { v4 as genId } from "uuid";

//ui
import Layout from "../../../components/Layout";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import Input from "../../../components/Input";
import Loading from "../../../components/Loading";

import ModalNewArea from "./ModalNewArea";

//styles
import { Typography, message } from "antd";
import "./style.css";

//controller
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../../server/api/axios";

//utils
import { handleGetLocal, handleSaveLocal } from "../../../utils/localStorage";
import { handleGenerateDate } from "../../../provider/CurrentDateProvider";

//interface
import { NewArea, DraftedArea } from "../../../interface/manage";

//icons
import { IoAddOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { IoDuplicateOutline } from "react-icons/io5";

const NewAreaField = () => {
  const [messageApi, contextMessage] = message.useMessage();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newOnOpen, setOnOpen] = useState<boolean>(false);
  const [onDelete, setOnDelete] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<NewArea | null>(null);
  const [allDraft, setAllDraft] = useState<DraftedArea[] | []>([]);
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [onDuplicate, setOnDulicate] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");

  const { auditID } = useParams();
  const navigate = useNavigate();

  const {
    data: draftList,
    isError: draftIsErro,
    refetch,
  } = useQuery({
    queryKey: ["draftList"],
    queryFn: () => axios.get("/data/area-draft-list"),
  });

  const handleCacheData = async () => {
    try {
      const string: string = JSON.stringify(draftList?.data as string);
      await handleSaveLocal("draftData", string);
    } catch (error) {
      messageApi.error(`Sorry something went wrong caching draft: ${error}`);
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
      }
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`);
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

  const handleRemveDraftedItem = async () => {
    if (!selectedItem || selectedItem === null) return;
    try {
      const response = await axios.delete("/data/delete-drafted", {
        params: { id: selectedItem.id },
      });
      if (response.status === 200) {
        refetch();
        setOnDelete(false);
        messageApi.success(`Success!`);
        return;
      }
      messageApi.error(`${response.data.message}`);
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`);
    }
  };

  const handleDuplicateItem = async () => {
    const date = await handleGenerateDate();
    if (selectedItem?.title === newTitle) {
      messageApi.warning("Area name already exist.");
      return;
    }
    try {
      const response = await axios.post(`/data/duplicate-item`, {
        id: selectedItem?.id,
        date: date,
        title: newTitle,
      });
      if (response.status === 200) {
        refetch();
        setOnDulicate(false);
        messageApi.success(`Success!`);
        return;
      }
      messageApi.warning(`${response.data.message}`);
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`);
    }
  };

  if (isLoading) {
    return <Loading type={"classic"} />;
  }

  return (
    <Layout style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}>
      {contextMessage}

      <div style={{ width: "100%", height: "10%", padding: "8px" }}>
        <Typography.Title level={3}>Create new area | Draft</Typography.Title>
      </div>
      <div
        id="gridList"
        style={{ width: "100%", height: "90%", overflowY: "auto" }}
      >
        <div className="item-container">
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
                    className="drafted-item"
                    key={index}
                    onClick={() => handleNavigateNew(item.areaKey)}
                  >
                    <div
                      style={{ width: "100%", height: "auto", padding: "8px" }}
                    >
                      <Typography.Paragraph
                        ellipsis={{
                          rows: 2,
                        }}
                        className="item-main-text"
                      >
                        Title: {item.title}
                      </Typography.Paragraph>
                    </div>
                    <div
                      style={{
                        padding: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        style={{ fontSize: ".8rem", fontWeight: 500 }}
                      >
                        Last saved: {item.timestamp || "No Date found"}
                      </Typography>

                      <div
                        style={{ width: "auto", display: "flex", gap: "4px" }}
                      >
                        <Button
                          size="small"
                          onClick={(e) => {
                            e?.stopPropagation();
                            setOnDulicate(true);
                            setSelectedItem({
                              id: item.areaKey,
                              title: item.title,
                            });
                            setNewTitle(item.title);
                          }}
                        >
                          <IoDuplicateOutline />
                        </Button>
                        <Button
                          size="small"
                          onClick={(e) => {
                            e?.stopPropagation();
                            setOnDelete(true);
                            setSelectedItem({
                              id: item.areaKey,
                              title: item.title,
                            });
                          }}
                        >
                          <MdDeleteOutline />
                        </Button>
                      </div>
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
      <Modal
        width={400}
        onFunction={handleRemveDraftedItem}
        title="Remove this item?"
        children={undefined}
        openModal={onDelete}
        setCloseModal={() => {
          setOnDelete(false);
          setSelectedItem(null);
        }}
      />
      <Modal
        width={400}
        onFunction={handleDuplicateItem}
        title="Duplicate this item?"
        children={
          <>
            <div
              style={{
                width: "100%",
                height: "auto",
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <Typography style={{ width: "80px", fontWeight: 500 }}>
                Title:{" "}
              </Typography>
              <Input
                onChange={(e) => setNewTitle(e.target.value)}
                value={newTitle}
                size={"small"}
                placeholder="Enter new title"
                variant={undefined}
              />
            </div>
          </>
        }
        openModal={onDuplicate}
        setCloseModal={() => setOnDulicate(false)}
      />
    </Layout>
  );
};

export default NewAreaField;
