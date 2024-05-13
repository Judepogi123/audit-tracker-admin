import React from "react";

//ui
import Layout from "../../../components/Layout";
import Button from "../../../components/Button";
import { Typography } from "antd";
import Select from "../../../components/Select";

//controller
import { useSearchParams } from "react-router-dom";

interface ArchiveListProps {}

const menuList = [
  { label: "Area", value: "area" },
  { label: "Compliance", value: "compliance" },
  { label: "Locale", value: "locale" },
  { label: "Users", value: "users" },
];

const Archive = () => {
  const [searchParams, setSearchParams] = useSearchParams({ archive: "area" });
  const currentArchive = searchParams.get("archive");

  const handleChangeArchive = (value: string) => {
    setSearchParams(
      (prev) => {
        prev.set("archive", value);
        return prev;
      },
      { replace: true }
    );
  };
  return (
    <Layout style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}>
      <div
        style={{
          width: "100%",
          height: "10%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Select
        value={currentArchive}
        onChange={handleChangeArchive}
          placeholder="Select"
          style={{ marginLeft: "8px", width: "150px" }}
          defaultValue="area"
          options={menuList}
          size={undefined}
        />
      </div>
    </Layout>
  );
};

export default Archive;
