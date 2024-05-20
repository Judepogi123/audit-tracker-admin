import { useParams } from "react-router-dom";


import { message } from "antd";

import { Typography } from "antd";
import Layout from "../../../components/Layout";



const CheckIndicator = () => {
  const { complianceID, zipCode } = useParams();
  console.log(complianceID, zipCode );
  

  return (
    <Layout>
      <Typography style={{ fontWeight: "initial" }}>
        Click "Confirm" to mark this indicator
      </Typography>
    </Layout>
  );
};

export default CheckIndicator;
