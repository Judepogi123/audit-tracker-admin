import React from "react";
import { v4 as genID } from "uuid";

import axios from "../../../server/api/axios";

import Layout from "../../components/Layout";
import Input from "../../components/Input";


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
