import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LOGO from "../assets/newDILG.png";
import "./style.scss";

import { Layout, Image, Typography } from "antd";

//ui
import Popover from "../components/Popover";
import Avatar from "../components/Avatar";
import UserProfile from "./userProfile.tsx/UserProfile";

import { useUserData } from "../provider/DataProvider";

import { UserProps } from "../interface/manage";

const Header = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserProps>()

  const navigate = useNavigate()

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };


  const data = useUserData() 

  useEffect(()=>{
    if(data){
      setUserData(data)
    }
  },[])

  return (
    <Layout
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fffcf2",
      }}
    >
      <div className="left-header">
        <Image className="logo" width={40} src={"https://firebasestorage.googleapis.com/v0/b/audit-tracker-d4e91.appspot.com/o/newDILG.png?alt=media&token=0bbfa570-0f69-4b55-8fa3-26cece766830" || LOGO} />
        <Typography.Title level={4} onClick={()=> navigate("/")} style={{cursor: "pointer"}}>
          Department of the Interior and Local Government
        </Typography.Title>
      </div>
      <div className="right-header">

        <div className="profile-container">
          <Popover
            open={open}
            onOpenChange={handleOpenChange}
            trigger="click"
            content={<UserProfile />}
            placement="topRight"
          >
            <div>
              <Avatar
                size={40}
                src={userData?.userProfilePicture || "https://firebasestorage.googleapis.com/v0/b/audit-tracker-d4e91.appspot.com/o/user.png?alt=media&token=b17c90e3-5244-4a4c-a6f6-0c960b052d13"}
              />
            </div>
          </Popover>
        </div>
      </div>
    </Layout>
  );
};

export default Header;
