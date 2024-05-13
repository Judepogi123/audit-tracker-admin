import React, { useState } from "react";
import { Layout } from "antd";
import { useSearchParams } from "react-router-dom";

import "./_sglg/style.scss";

import Tabs from "../../components/Tabs";

import System from "./_sglg/System";
import Users from "./_users/Users";
import AdminLogs from "./_logs/AdminLogs";
import Files from "./files/Files";
import Archive from "./archive/Archive";
import Audits from "./_sglg/Audits";

const tablists = [
  { label: "Audit", key: "audit" },
  { label: "Users", key: "users" },
  { label: "Archived", key: "archive" },
  { label: "Activity Logs", key: "logs" },
];


const ManageUsers = () => {
  const [selectedTab, setSelectedTab] = useState<string>("audit");

  const [searchParams, setSearchParams]= useSearchParams({current: "Audit"})
  const currentMangae = searchParams.get("current")

  const handleChangePath = (value: string)=>{
    setSearchParams((prev)=>{
      prev.set("current", value);
      return prev
    },{replace: true})
  }
  

  const handleRenderTab = (value: string) => {
    switch (value) {
      case "audit":
        return <Audits />;
      case "users":
        return <Users />;
      case "logs":
        return <AdminLogs />;
      case "archive":
        return <Archive/>
      default:
        return <Audits />;
    }
  };

  const handleChangeTabs = (key: string) => {
    setSelectedTab(key);
  };
  return (
    <Layout
      style={{ width: "100%", height: "100%", backgroundColor: "#fffcf2" }}
    >
      <div className="tabs-content">
        <Tabs defaultActiveKey={currentMangae as string} position="top" items={tablists} onChange={handleChangePath} />
      </div>
      <div className="tabs-selection">{handleRenderTab(currentMangae as string)}</div>
    </Layout>
  );
};

export default ManageUsers;
