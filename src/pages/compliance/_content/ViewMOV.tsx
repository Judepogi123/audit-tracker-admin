import React from "react";
import Layout from "../../../components/Layout";
import { Typography } from "antd";
import { handleFileSize } from "../../../utils/FileSize";

import EmptyList from "../../../components/EmptyList";

interface MovProps {
  data: string;
}

interface FileProps {
  fileName: string;
  fileSize: number;
  fileLink: string;
  fileDate: string;
}

const ViewMOV = ({ data }: MovProps) => {
  const temp: FileProps[] =
    data !== undefined ? JSON.parse(data as string) : [];

  const openFileLink = (fileLink: string) => {
    window.open(fileLink, "_blank"); 
  };

  return (
    <Layout
      style={{
        width: "100%",
        height: "auto",
        maxHeight: "600px",
        overflow: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        {temp.length < 1 ? (
          <div><EmptyList/></div>
        ) : (
          temp.map((item, index) => (
            <div
              key={index}
              style={{
                width: "100%",
                height: "auto",
                padding: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                cursor: "pointer",
                backgroundColor: "#fff"
              }}
              onClick={() => openFileLink(item.fileLink)} // Call openFileLink when clicked
            >
              <div>
                <div>
                  {/* Display file name */}
                  <Typography style={{fontWeight: 600, marginLeft: "8px"}}>{item.fileName}</Typography>
                </div>
              </div>
              <div>
                {/* Display file size */}
                <Typography
                  style={{ fontSize: ".7rem", fontWeight: "initial", marginLeft: "8px" }}
                >
                  {handleFileSize(item.fileSize)}
                </Typography>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default ViewMOV;
