import { useEffect, useState } from "react";

// ui
import Layout from "../../../components/Layout";
import Button from "../../../components/Button";
import { Typography, message } from "antd";
import Select from "../../../components/Select";
import Modal from "../../../components/Modal";

// controller
import { useSearchParams, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "../../../../server/api/axios";
import { handleGetLocal, handleSaveLocal } from "../../../utils/localStorage";
import { useUserData } from "../../../provider/DataProvider";
import Checkbox from "../../../components/Checkbox";

// page
import Area from "./selection/Area";
import Compliance from "./selection/Compliance";

// icons
import { MdDeleteOutline, MdOutlineUnarchive } from "react-icons/md";
import { PermissionsProps } from "../../../interface/manage";

const menuList = [
  { label: "Area", value: "area" },
  { label: "Compliance", value: "compliance" },
  { label: "Locale", value: "locale" },
  { label: "Users", value: "users" },
];

const Archive = () => {
  const [searchParams, setSearchParams] = useSearchParams({ archive: "area" });
  const currentArchive = searchParams.get("archive");
  const [selectedList, setSelectedList] = useState<(string | boolean)[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedAction, setSelectedAction] = useState<
    { active: boolean; action: string; type: string } | undefined
  >();
  const [permission, setPermission] = useState<
    PermissionsProps | string | null
  >(null);
  const [messageApi, contextMessage] = message.useMessage();

  const user = useUserData();

  useEffect(() => {
    const handleUserPermission = () => {
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

    handleUserPermission();
    return () => setPermission(null);
  }, [user]);

  const { data: areas, refetch } = useQuery({
    queryKey: ["areas"],
    queryFn: () => axios.get(`/data/areas`),
  });

  const handleChangeArchive = (value: string) => {
    setSearchParams(
      (prev) => {
        prev.set("archive", value);
        return prev;
      },
      { replace: true }
    );
    setSelectedList([]);
    setSelectAll(false);
  };

  const handleCache = async () => {
    try {
      if (areas?.data) {
        const data = areas.data;
        await handleSaveLocal("areasList", JSON.stringify(data));
      }
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`);
    }
  };

  useEffect(() => {
    handleCache();
  }, [areas?.data]);

  const handleRefetch = () => {
    refetch().then(() => {
      setSelectedList([]);
      setSelectAll(false);
      setSelectedAction(undefined);
    });
  };

  const handleExeAction = async (type: string,archive: string) => {
    if (!selectedList) return;

    try {
      const response = await axios.post(`/data/${type}-${archive}`, {
        dataList: selectedList,
      });
      if (response.status === 200) {
        handleRefetch();
        messageApi.success("Success!");
      } else {
        messageApi.error(`${response.data.message}`);
      }
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`);
    }
  };

  const handleAction = (type: string) => {
    if (
      permission &&
      typeof permission === "object" &&
      "archived" in permission
    ) {
      if (permission.audit === "archivedR" || user.userPermission !== "all") {
        messageApi.warning(`Current user is not authorized for this action!`);
        return;
      }
    }
    try {
      setSelectedAction({
        action: type,
        active: true,
        type: currentArchive as string,
      });
    } catch (error) {
      messageApi.error(`Sorry something went wrong!`);
      setSelectedAction(undefined);
    }
  };

  const handleRender = () => {
    switch (currentArchive) {
      case "area":
        return (
          <Area
            selectAll={selectAll}
            selectedList={selectedList}
            setSelectedList={setSelectedList}
            handleRefetch={handleRefetch}
          />
        );
      case "compliance":
        return (
          <Compliance
            selectAll={selectAll}
            selectedList={selectedList}
            setSelectedList={setSelectedList}
            handleRefetch={handleRefetch}
          />
        );
      // Add cases for other archives as needed
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
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Checkbox
            checked={selectAll}
            onChange={() => setSelectAll(!selectAll)}
          >
            <Typography>Select all</Typography>
          </Checkbox>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Select
            value={currentArchive}
            onChange={handleChangeArchive}
            placeholder="Select"
            style={{ marginLeft: "8px", width: "150px", marginRight: "16px" }}
            defaultValue="area"
            options={menuList}
            size={undefined}
          />

          <Button
            onClick={() => handleAction("unarchive")}
            disabled={selectedList.length === 0}
            style={{
              backgroundColor: "#0077b6",
              color: "#ccc",
              display: "flex",
              gap: "4px",
              marginRight: "8px",
            }}
          >
            <MdOutlineUnarchive fontSize={20} />
            Unarchive ({selectedList.length || 0})
          </Button>
          <Button
            onClick={() => handleAction("delete")}
            disabled={selectedList.length === 0}
            style={{
              backgroundColor: "#d62828",
              color: "#ccc",
              display: "flex",
              gap: "4px",
              marginRight: "8px",
            }}
          >
            <MdDeleteOutline fontSize={20} />
            Delete ({selectedList.length || 0})
          </Button>
        </div>
      </div>

      <div style={{ width: "100%", height: "90%" }}>{handleRender()}</div>
      <Modal
        onFunction={() => handleExeAction(selectedAction?.action as string, selectedAction?.type as string)}
        title={`${
          selectedAction?.action === "unarchive" ? "Unarchive" : "Delete"
        } selected item/s`}
        children={
          <Typography>
            {`Are you sure you want to ${
              selectedAction?.action === "unarchive" ? "unarchive" : "delete"
            } the selected item/s?`}
            {selectedAction?.action === "unarchive"
              ? null
              : " This action cannot be undone afterwards."}
          </Typography>
        }
        openModal={selectedAction?.active as boolean}
        setCloseModal={() => setSelectedAction(undefined)}
      />
    </Layout>
  );
};

export default Archive;
