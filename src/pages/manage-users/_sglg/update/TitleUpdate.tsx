import React from "react";

import { Layout } from "antd";
import Input from "../../../../components/Input";

interface TitleUpdateProps {
  placeholder: string;
}

const TitleUpdate = ({ placeholder }: TitleUpdateProps) => {
  return (
    <Layout
      style={{
        width: "100%",
        height: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
        <Input size={"small"} placeholder={placeholder} variant={"outlined"}/>
    </Layout>
  );
};

export default TitleUpdate;
