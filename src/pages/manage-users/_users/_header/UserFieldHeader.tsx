import React from "react";

import { Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { v4 as genUid } from "uuid";
import Layout from "../../../../components/Layout";
import Button from "../../../../components/Button";
import Tooltip from "../../../../components/Tooltip";
import Input from "../../../../components/Input";

const UserFieldHeader = () => {
    const [messageApi, contextMessage] = message.useMessage()
  const navigate = useNavigate();

  const handleNavigatePath =()=>{
    try {
        navigate(`/manage/new-user/${genUid()}`)
    } catch (error) {
       messageApi.error(`Sorry, could not navigate add new user page: ${error}`)
    }
  }
  return (
    <Layout
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
        {contextMessage}
      <div style={{ width: "100%", padding: "5px" }}>
        <Input
          style={{ width: "100%" }}
          size={"small"}
          placeholder={"Search user"}
          variant={undefined}
        />
      </div>
      <div style={{ width: "auto", padding: "5px" }}>
        <Tooltip enterDelay={1} title="Add new user">
          <>
            <Button onClick={handleNavigatePath}>Add User</Button>
          </>
        </Tooltip>
      </div>
    </Layout>
  );
};

export default UserFieldHeader;
