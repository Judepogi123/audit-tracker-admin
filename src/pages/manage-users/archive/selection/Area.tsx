import { useState, useEffect } from "react";

// interface
import { AreaProps } from "../../../../interface/manage";
import { ComplianceDataProps } from "../../../../interface/compliance";

// controller
import { useQuery } from "@tanstack/react-query";
import axios from "../../../../../server/api/axios";

// ui
import { message, Typography } from "antd";
import Layout from "../../../../components/Layout";
import Modal from "../../../../components/Modal";
import Checkbox from "../../../../components/Checkbox";

// utils
import { handleGetLocal, handleSaveLocal } from "../../../../utils/localStorage";
import { handleCheckString } from "../../../../utils/_list";

import "../style.scss";

interface AreaListProps {
  handleRefetch: () => void;
  selectedList: (string | boolean)[];
  setSelectedList: React.Dispatch<React.SetStateAction<(string | boolean)[]>>;
  selectAll: boolean;
}

const Area = ({ handleRefetch, selectedList, setSelectedList, selectAll }: AreaListProps) => {
  const [messageApi, contextMessage] = message.useMessage();
  const [areaList, setAreaList] = useState<AreaProps[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [unArchive, setUnarchive] = useState<AreaProps | undefined>(undefined);

  const handleGetArea = async () => {
    setIsLoading(true);
    try {
      const cache = await handleGetLocal("areasList");
      if (cache) {
        const temp: AreaProps[] = JSON.parse(cache as string);

        setAreaList(
          temp.length ? temp.filter((item) => item.archived === true) : []
        );
        return;
      }
      const response = await axios.get(`/data/areas`);
      if (response.status === 200 && response.data) {
        const data: AreaProps[] = response.data;
        setAreaList(
          data.length ? data.filter((item) => item.archived === true) : []
        );
        await handleSaveLocal("areasList", JSON.stringify(data));
      } else {
        setAreaList([]);
      }
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetArea();
    return () => setAreaList([]);
  }, []);

  const handleUnarchive = async () => {
    if (!unArchive) return;
    try {
      const response = await axios.post(`/data/unarchive-area`, {
        pushKey: selectedList,
      });
      if (response.status === 200) {
        handleRefetch();
        setUnarchive(undefined);
        messageApi.success("Success!");
      } else {
        messageApi.error(`${response.data.message}`);
      }
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`);
    }
  };

  const handleStringList = (id: string) => {
    try {
      const valueCopy = [...selectedList];
      const matchedItem = valueCopy.findIndex((item) => item === id);

      if (matchedItem !== -1) {
        valueCopy[matchedItem] = false;
      } else {
        valueCopy.push(id);
      }
      setSelectedList(valueCopy.filter((item) => item !== false));
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const handleSelectAll = () => {
      if (selectAll) {
        const newCopy = [...areaList];
        const stringList: string[] = newCopy.map((item) => item.pushKey);
        setSelectedList(stringList);
        return;
      }
      setSelectedList([]);
    };
    handleSelectAll();
  }, [selectAll]);

  return (
    <Layout style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}>
      {contextMessage}

      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "4px 8px",
          overflowY: "auto",
          gap: "8px",
        }}
      >
        {isLoading ? (
          <div className="empty-list">
            <Typography style={{ margin: "auto" }}>Empty</Typography>{" "}
          </div>
        ) : areaList.length === 0 ? (
          <div className="empty-list">
            <Typography
              style={{ margin: "auto", fontSize: "1.1rem", fontWeight: 600 }}
            >
              Empty
            </Typography>{" "}
          </div>
        ) : (
          areaList.map((item) => (
            <Checkbox
              value={item.pushKey}
              checked={handleCheckString(
                selectedList as string[],
                item.pushKey
              )}
              onChange={(e) => handleStringList(e.target.value)}
              className="areaItem"
              key={item.pushKey}
              style={{
                width: "100%",
                padding: "8px 16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                display: "flex",
                cursor: "pointer",
              }}
            >
              <div style={{ marginLeft: "16px" }}>
                <Typography style={{ fontWeight: 500, fontSize: "1.1rem" }}>
                  {item.title}
                </Typography>
                <Typography style={{ fontWeight: 500 }}>
                  Date archived: {item.dateArchived}
                </Typography>
              </div>
            </Checkbox>
          ))
        )}
      </div>
      <Modal
        width={500}
        onFunction={handleUnarchive}
        title={`Unarchive area ${unArchive?.title}`}
        children={undefined}
        openModal={unArchive !== undefined}
        setCloseModal={() => setUnarchive(undefined)}
      />
    </Layout>
  );
};

export default Area;
