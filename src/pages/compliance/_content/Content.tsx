import React, { useEffect } from "react";
import { FcDocument } from "react-icons/fc";
import Layout from "../../../components/Layout";
import Badge from "../../../components/Badge";

import { useNavigate } from "react-router-dom";

import axios from "../../../../server/api/axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { MessageInstance } from "antd/es/message/interface";

import { Skeleton, Typography } from "antd";

interface ContentProps {
  messageApi?: MessageInstance;
}

interface DataProps {
  fieldAnnswer: string;
  fieldPushKey: string;
  pushKey: string;
  status: string;
  viewed: boolean;
  timestamp: string;
  zipCode: string;
  senderZ: string;
}

const Content = ({ messageApi }: ContentProps) => {
  const { municipalID } = useParams();
  const navigate = useNavigate();

  const fetchData = async () => {
    const response = await axios.get("/data/compliance");
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dataPost"],
    queryFn: () => axios.get("/data/compliance"),
  });

  console.log(data);

  const handleGetCompliance = async () => {
    try {
    } catch (error) {
      messageApi?.error(`Sorry, something went wrong: ${error}`);
    }
  };

  useEffect(() => {
    if (isError) {
      messageApi?.error(`Sorry, something went wrong:${isError}`);
    }
  }, [data, isError]);




const handleViewCompliance = async (zipCode: string, pushKey: string, status: boolean) => {
  try {
    if(status){
      navigate(`/compliance/${zipCode}/${pushKey}`);
      return
    }
    const response = await axios.post('/data/update-props', {
      zipCode,
      pushKey,
    });

    if (response.status === 200) {
      navigate(`/compliance/${zipCode}/${pushKey}`);
    } else {
      console.error('Error updating data:', response.data);
      // Handle specific errors based on response status or data
      messageApi?.error('An error occurred. Please try again.');
    }
  } catch (error) {
    console.error('Error sending data:', error);
    messageApi?.error('Sorry, something went wrong. Please try again.');
  }
};


  return (
    <Layout
      id="com-list"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        padding: "5px 10px",
        backgroundColor: "#fff",
        overflow: "hidden",
      }}
    >
      {isLoading ? (
        <Skeleton active={true} title={false} />
      ) : (
        Object.values(data?.data as DataProps[]).map((item) => (
          <CompianceItem handleViewCompliance={handleViewCompliance} data={item} />
        ))
      )}
    </Layout>
  );
};

export default Content;

const CompianceItem = ({
  data,
  handleViewCompliance,
}: {
  data: DataProps;
  handleViewCompliance: (zipCode: string, pushKey: string, status: boolean) => Promise<void>;
}) => {
  return (
    <div
    onClick={()=> handleViewCompliance(data.zipCode, data.pushKey, data.viewed)}
      key={data.pushKey}
      style={{
        width: "100%",
        height: "auto",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        border: "1px solid #ccc",
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        borderRadius: "5px",
        backgroundColor: data.viewed ? "" : "#caf0f8",
      }}
    >
      <div style={{ width: "auto", display: "flex" }}>
        <FcDocument fontSize={25} />
        <Typography>{data.pushKey}</Typography>
      </div>
      <div style={{ width: "auto" }}>
        <Typography style={{ fontWeight: "normal" }}>
          {data.timestamp}
        </Typography>
      </div>
    </div>
  );
};
