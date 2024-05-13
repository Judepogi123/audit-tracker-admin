import React from "react";
import { v4 as genID } from "uuid";

import { useQuery } from "@tanstack/react-query";
import axios from "../../../server/api/axios";

import Layout from "../../components/Layout";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Select from "../../components/Select";
import Checkbox from "../../components/Checkbox";

import { Typography } from "antd";
import { MessageInstance } from "antd/es/message/interface";

import { NewAudit } from "../../interface/manage";

import { CiCircleInfo } from "react-icons/ci";

interface NewKeyProps {
  messageApi: MessageInstance;
  formValues: NewAudit;
  setFormValue: React.Dispatch<React.SetStateAction<NewAudit | null>>;
  keyType: string
}

const NewAuditKey = ({ messageApi,setFormValue,formValues,keyType }: NewKeyProps) => {
  let genKey = genID();
  const handleCheckKey = async (key: string) => {
    try {
      const request = await axios.post("/data/", {
        key: key,
        type: keyType
      });
      if (request.status === 200 && request.data.status === "sucess") {
        return request.data.status;
      } else {
        return request.data.status;
      }
    } catch (error) {
      messageApi.error(`Sorry something went wrong generating key: ${error}`);
    }
  };
  const handleCreateAuditKey = async () => {
    try {
      const resultKey = await handleCheckKey(genKey);
      if (resultKey === "sucess") {
      } else if (resultKey === "existed") {
      }
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`);
    }
  };

  return (
    <Layout style={{ width: "100%", height: "auto", backgroundColor: "#fff" }}>
      <div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            padding: "4px",
            alignItems: "center",
          }}
        >
          <CiCircleInfo />
          <Typography style={{ fontSize: "6.rem" }}>
            Declare binding key (ex. XXXX-XXX-XXXX-XXXX-XXXXX-
            <Typography style={{ fontSize: "6.rem", fontWeight: "bold" }}>
              key
            </Typography>{" "}
            ){" "}
          </Typography>
        </div>
        <Input
          onChange={(e) => setFormValue({...formValues, keys: e.target.value})}
          size={"small"}
          placeholder={""}
          variant={undefined}
        />
        <Typography>
          * To declare binding key, it must be the acronym of the desire audit
          title. (small caps)
        </Typography>
      </div>
    </Layout>
  );
};

export default NewAuditKey;
