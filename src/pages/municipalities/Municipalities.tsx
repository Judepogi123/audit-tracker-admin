import { useEffect, useState } from "react";

//ui
import Layout from "../../components/Layout";
import Tabs from "../../components/Tabs";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

import { Typography, message } from "antd";


//controller
import { useQuery } from "@tanstack/react-query";
import axios from "../../../server/api/axios";
import { useNavigate } from "react-router-dom";

import SearchBox from "./SearchBox";

import { handleGetLocal, handleSaveLocal } from "../../utils/localStorage";
import { useUserData } from "../../provider/DataProvider";

//interface
import { LocaleProps } from "../../interface/locale";
import { PermissionsProps } from "../../interface/manage";

const menuList = [
  { label: "All", value: "all" },
  { label: "Municipal", value: "municipal" },
  { label: "Barangay", value: "barangay" },
];

interface OptionProps {
  value: string | number;
  label: string;
  disabled?: boolean;
}

const Municipalities = () => {
  const [messageApi, contextMessage] = message.useMessage();
  
  const [localeList, setLocaleList] = useState<LocaleProps[] | null>(null);
  const [permission, setPermission] = useState<PermissionsProps | null>(null)
  const [onSearch, setOnSearch] = useState<boolean>(false);

  const navigate = useNavigate()
  const user = useUserData()

  useEffect(()=>{
    const handleUserPersmission = ()=>{
      try {
        const temp: PermissionsProps = user.userPermission === "all" ? "all" : JSON.parse(user.userPermission);
        setPermission(temp)
      } catch (error) {
        messageApi.error(`Something went wrong with user permission`)
      }
    }

    handleUserPersmission()
  },[user])

  const { data: localeData } = useQuery({
    queryKey: ["localeData"],
    queryFn: () => axios.get(`/data/locale`),
  });

  console.log(localeData?.data);

  // const handleCache = async()=>{
  //   try {
  //     const cache = await handleGetLocal("allLocaleList")
  //     let temp: LocaleProps[] | []
  //     if(cache){
  //       temp = JSON.parse(cache)
  //       setLocaleList(temp)
  //       return
  //     }

  //     const request = await axios.get("/data/locale")
  //     if(request.status === 200){
  //       const temp: LocaleProps[] = request.data
  //       setLocaleList(temp)
  //       const stringData = JSON.stringify(temp)
  //       await handleSaveLocal("allLocaleList",stringData)
  //     }else{
  //       setLocaleList([])
  //     }
  //   } catch (error) {
  //     messageApi.error(`Sorry something went wrong in fetching: ${error}`)
  //   }
  // }

  // useEffect(()=>{
  //   handleCache()
  // },[])

  const handleNavigate = ()=>{
    if (permission && typeof permission === 'object' && 'municipals' in permission) {
      if (permission.municipals === "minicipalR" || user.userPermission === "all") {
        messageApi.warning(`Current user is not authorized for this action!`);
        return;
      }
    }
    try {
       navigate("/municipalities/new-locale")
    } catch (error) {
      messageApi.error(`Something went wrong navigating the page: ${error}`)
    }
  }

  const handleCancelSearch = () => {
    setOnSearch(false);
  };

  return (
    <Layout style={{ width: "100%", height: "100%" }}>
      <div style={{ width: "100%", height: "18%" }}>
        <div style={{ width: "100%", padding: "8px" }}>
          <Typography style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
            Locale
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            padding: "0px 8px",
            gap: "8px",
          }}
        >
          <div
            onClick={() => setOnSearch(true)}
            style={{
              width: "100%",
              height: "32px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff",
              cursor: "text",
            }}
          >
            <Typography
              style={{
                fontWeight: "initial",
                marginLeft: "8px",
                color: "#adb5bd",
              }}
            >
              Search
            </Typography>
          </div>
          <Select
            defaultValue="all"
            style={{ width: "150px" }}
            options={menuList}
            size={undefined}
          />
          {/* <Tabs style={{ overflowX: "auto", width: "100%" }} items={menuList} /> */}
          <Button style={{backgroundColor: "#1982c4", color: "#fff"}} onClick={handleNavigate}>Add</Button>
        </div>
      </div>

      {/* <div style={{width: '100%', height: '82%',display: "flex", flexDirection:"column", gap: "4px"}}>
        {localeList && localeList.length < 1 ? <div>dasds</div> : localeList?.map((item)=> (
          <div style={{}}>{item.municipalityName}</div>
        ))}
      </div> */}
      <Modal
      title="Search locale"
      width={800}
      okHid={true}
        children={<SearchBox/>}
        openModal={onSearch}
        setCloseModal={handleCancelSearch}
      />
      {contextMessage}
    </Layout>
  );
};

export default Municipalities;
