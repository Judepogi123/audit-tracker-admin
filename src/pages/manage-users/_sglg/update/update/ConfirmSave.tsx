import  { Dispatch, SetStateAction } from "react";

import { Typography, Layout, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface SaveProps {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>
}

const ConfirmSave = ({ isLoading, setIsLoading }: SaveProps) => {
  return (
    <Layout
      style={{
        width: "100%",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        backgroundColor: "#fff"
      }}
    >
      {isLoading ? (
        <div style={{ width: "100%", height: "auto", display: "grid" }}>
          <div
            style={{
              width: "auto",
              display: "flex",
              flexDirection: "column",
              margin: "auto",
              backgroundColor: "#fff"
            }}
          >
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
            <Typography.Text>Please wait...</Typography.Text>
          </div>
        </div>
      ) : (
        <div style={{ width: "100%", height: "auto",backgroundColor: "#fff" }}>
          <Typography.Title level={3}>Confirm save?</Typography.Title>
        </div>
      )}
    </Layout>
  );
};

export default ConfirmSave;
