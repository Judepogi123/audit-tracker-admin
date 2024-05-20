import { useState } from "react";

//ui
import Layout from "../../components/Layout";
import Tabs from "../../components/Tabs";
import { Typography } from "antd";
import Modal from "../../components/Modal";
import SearchBox from "./SearchBox";

//controller
import { useSearchParams } from "react-router-dom";

//api


//interface


const menuList = [
  { label: "All", key: `all` },
  { label: "Municipal", key: `municipal` },
  { label: "Barangay", key: `barangay` },
];

const AllCompliance = () => {
  const [onSearch, setOnSearch] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams({
    menu: "all",
  });
  const currentMenu = searchParams.get("menu");

  const handleChangeMenu = (value: string) => {
    setSearchParams(
      (prev) => {
        prev.set("menu", value);
        return prev;
      },
      { replace: true }
    );
  };




  return (
    <Layout style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}>
      <div
        style={{
          width: "100%",
          height: "20%",
          display: "flex",
          padding: "8px",
          border: "1px solid #ccc",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <Tabs
          activeKey={currentMenu as string}
          defaultActiveKey="all"
          onChange={handleChangeMenu}
          items={menuList}
        />
        <div style={{ width: "100%" }}>
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
        </div>
      </div>


      <Modal
        okHid={true}
        width={800}
        children={<SearchBox />}
        openModal={onSearch}
        setCloseModal={() => setOnSearch(false)}
      />
    </Layout>
  );
};

export default AllCompliance;
