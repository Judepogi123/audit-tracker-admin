import React, { useEffect, useState } from "react";
import { useNavigate, Outlet, useSearchParams } from "react-router-dom";
import axios from "../../../server/api/axios";
import { useQuery } from "@tanstack/react-query";

import Layout from "../../components/Layout";
import Button from "../../components/Button";
import Select from "../../components/Select";
import Spinner from "../../components/Spinner";
import { handleGetValueLabel } from "../../utils/_global-functions";

import { Typography, message } from "antd";

import Header from "./_header/Header";
import { OptionProps } from "antd/es/select";

interface MunicipalitiesProps {
  municipalityName: string;
  zipCode: number;
}

const Compliance = () => {
  const [municipalities, setMunicipalities] = useState<
  OptionProps[] | undefined
  >(undefined);

   const [selectedField, setSelectedField] = useState<string>("all")
   const [messageApi, contextMessage]= message.useMessage()
  const navigate = useNavigate();

  const {
    data: towns,
    isLoading,
    isError,
  } = useQuery({
    queryFn: () => axios.get("http://localhost:3000/data/municipalities"),
    queryKey: ["towns"],
  });

  // useEffect(() => {
  //   const data = handleGetValueLabel(Object.values(towns?.data[0]))
  //   setMunicipalities(data)
  // }, []);

  //console.log(handleGetValueLabel(Object.values(towns?.data[0] || [])));

  useEffect(()=>{
    try {
      navigate(`/compliance/${selectedField}`)
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`)
    }
  },[selectedField])

  const handleChangeTabs = ()=>{
    try {
      navigate(`/compliance/:${selectedField}`)
    } catch (error) {
      messageApi.error(`Sorry, something went wrong: ${error}`)
    }
  }

  return (
    <Layout style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}>
      {contextMessage}
      <div
        style={{
          width: "100%",
          height: "13%",
          overflow: "hidden",
        }}
      >
        <Header setSelectedMunicipal={setSelectedField} />
      </div>
      {isLoading ? (
        <div>
          <Spinner />
        </div>
      ) : (
        <>
        <div
          style={{
            width: "100%",
            height: "7%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "5px",
            padding: "0px 20px",
          }}
        >
          <div
            style={{
              width: "200px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textAlign: "center",
            }}
          >
            <Typography.Title style={{ width: "120px" }} level={5}>
              Municipal:{" "}
            </Typography.Title>
            <Select
            size="small"
              style={{ width: "100px" }}
              options={[{ value: "boac", label: "Boac" }]}
            />
          </div>
          <div
            style={{
              width: "150px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textAlign: "center",
            }}
          >
            <Typography.Title style={{ width: "120px" }} level={5}>
              Year:{" "}
            </Typography.Title>
            <Select
              size="small"
              style={{ width: "100px" }}
              options={[{ value: "2023", label: "2023" }]}
            />
          </div>
        </div>
        <div style={{width: "100%", height: "80%"}}>
          <Outlet/>
        </div>
        </>
      )}
    </Layout>
  );
};

export default Compliance;
