import { useState, useEffect } from "react";

import { Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { v4 as genUid } from "uuid";
import Layout from "../../../../components/Layout";
import Button from "../../../../components/Button";
import Tooltip from "../../../../components/Tooltip";
import Input from "../../../../components/Input";

import { useUserData } from "../../../../provider/DataProvider";
import { PermissionsProps } from "../../../../interface/manage";

const UserFieldHeader = () => {
    const [messageApi, contextMessage] = message.useMessage()
    const [permission, setPermission] = useState<PermissionsProps | null>(null)
  const navigate = useNavigate();

  const user = useUserData()

  useEffect(()=>{
    const handleUserPersmission = ()=>{
      try {
        const temp: PermissionsProps =  user.userPermission === "all" ? "all" :JSON.parse(user.userPermission);
        setPermission(temp)
      } catch (error) {
        messageApi.error(`Something went wrong with user permission`)
      }
    }
    handleUserPersmission()

    return ()=>setPermission(null)
  },[user])

  const handleNavigatePath =()=>{
    if (permission && typeof permission === 'object' && 'users' in permission) {
      if (permission.users === "usersR" || user.userPermission === "all") {
        messageApi.warning(`Current user is not authorized for this action!`);
        return;
      }
    }
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
            <Button style={{backgroundColor: "#1982c4", color: "#fff"}} onClick={handleNavigatePath}>Add User</Button>
          </>
        </Tooltip>
      </div>
    </Layout>
  );
};

export default UserFieldHeader;
