import { useState,useEffect } from "react";
import LOGO from "../assets/newDILG.png";
import { IoNotifications } from "react-icons/io5";
import "./style.scss";

import { Layout, Image, Typography } from "antd";

//ui
import Popover from "../components/Popover";
import Avatar from "../components/Avatar";
import UserProfile from "./userProfile.tsx/UserProfile";
import UserNotification from "./userNotification/UserNotification";
import Badge from "../components/Badge";

import { useUserData } from "../provider/DataProvider";

//interface
import { UserProps } from "../interface/manage";

const Header = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserProps>()
  const [openNotif, setOpenNotif] = useState<boolean>(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleOpenNotif = (newOpen: boolean) => {
    setOpenNotif(newOpen);
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
        <Image className="logo" width={40} src={LOGO} />
        <Typography.Title level={4}>
          Department of the Interior and Local Government
        </Typography.Title>
      </div>
      <div className="right-header">
        <div className="notification-container">
          <Popover
            open={openNotif}
            onOpenChange={handleOpenNotif}
            trigger="click"
            content={<UserNotification />}
            placement="topRight"
          >
            <div>
            <Badge count={5}>
              <div>
                <IoNotifications fontSize={40} color="#ccc" />
              </div>
            </Badge>
            </div>
          </Popover>
        </div>


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
