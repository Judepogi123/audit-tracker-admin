import React from "react";

import Layout from "../../components/Layout";
import { Typography } from "antd";

interface ErrorPageProps {
  message: string;
}

const ErrorPage = ({ message }: ErrorPageProps) => {
  return (
    <Layout style={{ width: "100%", height: "100%", display: "grid" }}>
      <div
        style={{ width: "200px", height: "200px", border: "1px solid black" }}
      >
        <Typography>{message}</Typography>
      </div>
    </Layout>
  );
};

export default ErrorPage;
