import { SetStateAction, useState } from "react";
import { handleGetFilePath } from "../../../utils/file";

import axios from "../../../../server/api/axios";
import Layout from "../../../components/Layout";
import Avatar from "../../../components/Avatar";
import { MessageInstance } from "antd/es/message/interface";
import { Typography } from "antd";
import Button from "../../../components/Button";
import type { GetProp, UploadFile, UploadProps } from "antd";

import { UploadOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";

import Lottie from "lottie-react";
import warning from "../../../assets/animations/warning-0.json";
import success from "../../../assets/animations/success-001.json";
import loading from "../../../assets/animations/loading-001.json";
import Input from "../../../components/Input";

interface UserDataProps {
  username: string;
  password: string;
  assignedMunicipal: string;
  userType: string;
  adminType?: string;
  authority: string;
  compliance: string;
  users: string;
  files: string;
  municipals: string;
  archived: string;
  logs: string;
  fields: string;
  barangay: string
  audit: string
}

interface ConfirmUserProps {
  values: UserDataProps | undefined;
  messageApi: MessageInstance;
  isStatus: StatusProps;
  setIsStatus: React.Dispatch<SetStateAction<StatusProps>>;
  setFormValue: React.Dispatch<SetStateAction<UserDataProps | undefined>>;
  handleCloseConfirm: () => void;
}

interface StatusProps {
  message: string;
  status: string;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const ConfirmUser = ({
  values,
  messageApi,
  isStatus,
  setIsStatus,
  handleCloseConfirm,
  setFormValue,
}: ConfirmUserProps) => {
  const [selectedProfile, setSelectedProfile] = useState<string | undefined>(
    "https://firebasestorage.googleapis.com/v0/b/audit-tracker-d4e91.appspot.com/o/user.png?alt=media&token=b17c90e3-5244-4a4c-a6f6-0c960b052d13"
  );
  const handleSaveUser = async () => {
    setIsStatus({ message: "null", status: "loading" });
    try {
      const request = await axios.post("/data/new-user", {...values, selectedProfile});
      if (request.status === 200 && request.data.status === "success") {
        console.log(request.data);
        setFormValue(undefined);
        setIsStatus({ message: request.data.message, status: "success" });
      } else {
        setIsStatus({ message: request.data.message, status: "existed" });
      }
    } catch (error) {
      console.log(error);

      messageApi.error(`Sorry something went wrong: ${error}`);
    }
  };

  return (
    <Layout
      style={{
        width: "100%",
        height: "300px",
        backgroundColor: "#fff",
      }}
    >
      <Results
        setSelectedProfile={setSelectedProfile}
        selectedProfile={selectedProfile as string}
        handleCloseConfirm={handleCloseConfirm}
        handleSaveUser={handleSaveUser}
        result={isStatus}
        data={values}
      />
    </Layout>
  );
};

export default ConfirmUser;

const Results = ({
  result,
  data,
  handleSaveUser,
  handleCloseConfirm,
  selectedProfile,
  setSelectedProfile,
}: {
  result: { message: string; status: string };
  data: UserDataProps | undefined;
  handleSaveUser: () => Promise<void>;
  handleCloseConfirm: () => void;
  selectedProfile: string;
  setSelectedProfile: React.Dispatch<SetStateAction<string | undefined>>;
}) => {
  switch (result.status) {
    case "success":
      return (
        <Layout
          style={{
            width: "100%",
            height: "100%",
            display: "grid",
          }}
        >
          <div
            style={{
              width: "150px",
              height: "150px",
              margin: "auto",
            }}
          >
            <Lottie animationData={success} loop={false} />
            <div>
              <Typography>{result.message}</Typography>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                padding: "8px",
                marginTop: "16px",
                justifyContent: "center",
              }}
            >
              <Button onClick={handleCloseConfirm}>Close</Button>
            </div>
          </div>
        </Layout>
      );
    case "existed":
      return (
        <Layout
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "150px",
              height: "250px",
            }}
          >
            <Lottie animationData={warning} loop={true} />
            <div>
              <Typography
                style={{
                  fontSize: "1rem",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {result.message}
              </Typography>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                padding: "8px",
                marginTop: "16px",
                justifyContent: "center",
              }}
            >
              <Button onClick={handleCloseConfirm}>Close</Button>
            </div>
          </div>
        </Layout>
      );
    case "null":
      return (
        <Default
          setSelectedProfile={setSelectedProfile}
          selectedProfile={selectedProfile}
          handleCloseConfirm={handleCloseConfirm}
          handleSaveUser={handleSaveUser}
          data={data}
        />
      );
    case "loading":
      return (
        <Layout
          style={{
            width: "100%",
            height: "100%",
            display: "grid",
          }}
        >
          <div
            style={{
              width: "150px",
              height: "150px",
              border: "1px solid #ccc",
              margin: "auto",
            }}
          >
            <Lottie animationData={loading} loop={true} />
          </div>
        </Layout>
      );

    default:
      return (
        <Default
          setSelectedProfile={setSelectedProfile}
          selectedProfile={selectedProfile}
          handleCloseConfirm={handleCloseConfirm}
          handleSaveUser={handleSaveUser}
          data={data}
        />
      );
  }
};

const Default = ({
  data,
  handleSaveUser,
  handleCloseConfirm,
  selectedProfile,
  setSelectedProfile,
}: {
  data: UserDataProps | undefined;
  handleSaveUser: () => Promise<void>;
  handleCloseConfirm: () => void;
  selectedProfile: string;
  setSelectedProfile: React.Dispatch<SetStateAction<string | undefined>>;
}) => {
  

  return (
    <Layout
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#fff",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "85%",
          display: "flex",
        }}
      >
        <div
          style={{
            width: "40%",
            height: "100%",
            display: "grid",
          }}
        >
          <div
            style={{
              margin: "auto",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Avatar size={120} src={selectedProfile} />
            {/* <Input
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : undefined;
                setSelectedProfile(
                  file ? URL.createObjectURL(file) : undefined
                );
              }}
              type="file"
              size="small"
              placeholder=""
              variant={undefined}
            /> */}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <Typography>Username:</Typography>
            <Typography style={{ fontWeight: "bold" }}>
              {data?.username}
            </Typography>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Typography>User type:</Typography>
            <Typography style={{ fontWeight: "bold" }}>
              {data?.userType === "provincial" ? "Provincial" : "Municipal"}
            </Typography>
          </div>
          <div
            style={{
              display: data?.userType === "field" ? "block" : "none",
              gap: "8px",
            }}
          >
            <Typography>Zipcode:</Typography>
            <Typography style={{ fontWeight: "bold" }}>
              {data?.assignedMunicipal}
            </Typography>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "15%",
          padding: "8px",
          margin: "auto",
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
        }}
      >
        <Button onClick={handleCloseConfirm}>Cancel</Button>
        <Button
          style={{ backgroundColor: "#0077b6", color: "#fff" }}
          onClick={handleSaveUser}
        >
          Save
        </Button>
      </div>
    </Layout>
  );
};
