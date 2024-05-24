import { useState, useEffect } from "react";

//ui
import Layout from "../../../components/Layout";
import Button from "../../../components/Button";
import { Typography, message } from "antd";
import Spinner from "../../../components/Spinner";
import Modal from "../../../components/Modal";

//controller
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "../../../../server/api/axios";

//icons
import { MdDeleteOutline } from "react-icons/md";

//interface
import { LocaleListProps } from "../../../interface/compliance";
import Loading from "../../../components/Loading";


const Locale = () => {
  const [localeData, setLocaleData] = useState<LocaleListProps | undefined>();
  const [loading, setOnLoading] = useState<boolean>(false);
  const [onDeleted, setOnDelete] = useState<boolean>(false);
  const [messageApi, contextMessage] = message.useMessage();
  const { localeID } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["localeData"],
    queryFn: () => axios.get(`/data/locale-data`, { params: { localeID } }),
  });

  useEffect(() => {
    if (data?.data) {
      const temp: LocaleListProps = data.data;
      setLocaleData(temp);
      return;
    }
    setLocaleData(undefined);
  }, [data]);

  const handleRemoveLocale = async () => {
    setOnLoading(true)
    try {
      const response = await axios.delete(`/data/remove-locale`, {
        params: { localeID },
      });
      if (response.status === 200) {
        setOnLoading(false)
        messageApi.success(`Success!`);
        history.back();
        setLocaleData(undefined);
        return;
      }
      messageApi.error(`${response.data.message}`);
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`);
    }finally{
      setOnLoading(false)
    }
  };

  if (isLoading) {
    return (
      <div style={{ width: "100%", height: "100%", display: "grid" }}>
        <div style={{ margin: "auto" }}>
          <Spinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <Layout style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}>
      {contextMessage}
      <div
        style={{
          width: "100%",
          height: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            padding: "16px",
          }}
        >
          <div style={{ display: "flex" }}>
            <Typography style={{ fontWeight: 600, width: "130px" }}>
              Locale:
            </Typography>
            <Typography>{localeData?.municipalityName || "Unknown"}</Typography>
          </div>

          <div style={{ display: "flex" }}>
            <Typography style={{ fontWeight: 600, width: "130px" }}>
              Locale Zip code:
            </Typography>
            <Typography>{localeData?.zipCode || "Unknown"}</Typography>
          </div>

          <div style={{ display: "flex" }}>
            <Typography style={{ fontWeight: 600, width: "130px" }}>
              Locale Type:
            </Typography>
            <Typography>{localeData?.type ==="provincial"? "Provinvial" : localeData?.type === "municipal" ? "Municipal" : "Barangay"}</Typography>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "flex-end",
            padding: "8px",
          }}
        >
          <Button
            onClick={()=> setOnDelete(true)}
            style={{
              width: "auto",
              display: "flex",
              gap: "4px",
              backgroundColor: "#c1121f",
              color: "#fff",
            }}
          >
            <MdDeleteOutline fontSize={22} /> Remove
          </Button>
        </div>

      </div>
      <Modal
      onFunction={handleRemoveLocale}
        title="Remove locale"
        children={
          "By confirming this action, the locale will be delete completely afterwards and cannot be retrieve again."
        }
        openModal={onDeleted}
        setCloseModal={()=> setOnDelete(false)}
      />

<Modal
        width={400}
        okHid={true}
        cancelHid={true}
        children={
          <Loading type={"classic"}/>
        }
        openModal={loading}
        setCloseModal={()=>{
          if(loading){
            return
          }
          setOnLoading(false)
        }}
      />
    </Layout>
  );
};

export default Locale;
