import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../../../server/api/axios";


import { message } from "antd";

import { Typography } from "antd";
import Layout from "../../../components/Layout";



const CheckIndicator = () => {
  const { complianceID, zipCode } = useParams();
  const [messageApi, contextMessage] = message.useMessage();
  console.log(complianceID, zipCode );
  

  return (
    <Layout>
        {contextMessage}
      <Typography style={{ fontWeight: "initial" }}>
        Click "Confirm" to mark this indicator
      </Typography>
    </Layout>
  );
};

export default CheckIndicator;
