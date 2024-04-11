import React from "react";
import Layout from "../../../components/Layout";

import { Typography } from "antd";

interface ArchiveFieldProps {
  dataID: string | undefined;
}

const ArchiveField = ({ dataID }: ArchiveFieldProps) => {
  return (
    <Layout style={{ widows: "100%", height: "auto", backgroundColor: "#fff" }}>
      <Typography.Title level={4}>Archive this field?</Typography.Title>
    </Layout>
  );
};

export default ArchiveField;
