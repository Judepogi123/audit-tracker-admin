import React from "react";

import Layout from "../../../components/Layout";

import UserFieldHeader from "./_header/UserFieldHeader";

const Users = () => {
  return (
    <Layout style={{ width: "100%", height: "100%" }}>
      <div style={{ width: "100%", height: "10%", border: "1px solid #ccc" }}>
        <UserFieldHeader />
      </div>

      <div
        style={{
          width: "100%",
          height: "90%",
          display: "flex",
          flexDirection: "column",
        }}
      ></div>
    </Layout>
  );
};

export default Users;
