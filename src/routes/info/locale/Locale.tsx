import { useState, useEffect } from "react";

//ui
import Layout from "../../../components/Layout";
import Button from "../../../components/Button";
import { Typography, message } from "antd";
import Tabs from "../../../components/Tabs";
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

interface Tab {
  key: string;
  label: string | React.ReactNode;
  children?: React.ReactNode;
}

interface TabsProps {}

const items: Tab[] = [
  { label: "Compliance", key: "compliance" },
  { label: "Users", key: "users" },
];

const Locale = () => {
  const [localeData, setLocaleData] = useState<LocaleListProps | undefined>();
  const [deleting, setDeleting] = useState<boolean>(false);
  const [onDeleted, setOnDelete] = useState<boolean>(false);
  const [messageApi, contextMessage] = message.useMessage();
  const { localeID } = useParams();

  const { data, isLoading,isError } = useQuery({
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
    try {
      const response = await axios.delete(`/data/remove-locale`, {
        params: { localeID },
      });
      if (response.status === 200) {
        messageApi.success(`Success!`);
        history.back();
        setLocaleData(undefined);
        return;
      }
      messageApi.error(`${response.data.message}`);
    } catch (error) {
      messageApi.error(`Sorry something went wrong: ${error}`);
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

  if (!data?.data || isError) {
    return (
      <div style={{ width: "100%", height: "100%", display: "grid" }}>
        <div style={{ margin: "auto", textAlign: "center" }}>
          <Typography style={{fontWeight: 600, fontSize: "1.2rem"}}>Item not found | Someting went wrong</Typography>
          <Typography>Try to refresh the page!</Typography>
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
            <Typography>4900</Typography>
          </div>

          <div style={{ display: "flex" }}>
            <Typography style={{ fontWeight: 600, width: "130px" }}>
              Locale Type:
            </Typography>
            <Typography>4900</Typography>
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

        <div style={{ width: "100%", display: "flex" }}>
          <Tabs items={items} />
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
    </Layout>
  );
};

export default Locale;
