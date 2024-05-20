import { useState } from "react";

//ui
import Layout from "../../../components/Layout";
import { Typography } from "antd";

const ModalReturn = () => {
  return (
    <Layout style={{ width: "100%", height: "auto", backgroundColor: "#fff" }}>
      <Typography.Paragraph>
        Confirm action?

        Cannot undo afterwards. This compliance cannot be changed again.
      </Typography.Paragraph>
    </Layout>
  );
};

export default ModalReturn;
