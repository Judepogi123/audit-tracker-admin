import { Layout, Typography,Divider,Skeleton } from "antd";
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useNavigate } from "react-router-dom";

import Avatar from "../../components/Avatar";
import Button from "../../components/Button";


import { useUserData } from "../../provider/DataProvider";
import { handleSaveLocal } from "../../utils/localStorage";

const UserProfile = () => {
    const navigate = useNavigate()
    const signOut = useSignOut()

    const userData = useUserData()

    const handleSignOut = async()=>{
        try {
          await handleSaveLocal("selectedPath", "/dashboard");
            signOut()
            navigate("/auth/login")
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <Layout
      style={{
        width: "300px",
        height: "400px",
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#fffcf2",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "auto",
          padding: "5px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "auto",
            padding: "20px",
            display: "grid",
          }}
        >
          {userData ?
            <Avatar
            style={{ margin: "auto" }}
            size={100}
            src={userData.userProfilePicture || "https://firebasestorage.googleapis.com/v0/b/audit-tracker-d4e91.appspot.com/o/user.png?alt=media&token=b17c90e3-5244-4a4c-a6f6-0c960b052d13"}
          /> : <Skeleton paragraph={{ rows: 1, }} active/>
          }
          
        </div>
        <div style={{ textAlign: "center" }}>
          <Typography.Title level={3}>
            {userData.userFullName}
          </Typography.Title>
          <Typography.Text>{userData.userType === "headAdmin" ? "Provincial admin" : "Admin"}</Typography.Text>
        </div>

        <Divider/>
      </div>
      <div>
        <Button
        onClick={handleSignOut}
          style={{
            width: "100%",
            backgroundColor: "#c1121f",
            borderRadius: "20px",
          }}
          type={"primary"}
        >
          Logout
        </Button>
      </div>
    </Layout>
  );
};

export default UserProfile;
