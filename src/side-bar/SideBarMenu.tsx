import React, { useEffect, useState } from "react";

import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";

import { FaMountainCity } from "react-icons/fa6";

import axios from "../../server/api/axios";

type MenuItem = Required<MenuProps>["items"][number];

interface MunicipalityProps {
  municipalityName: string;
  zipCode: number;
}

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[] | string,
  type?: "group"
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
};

const items: MenuProps["items"] = [
  getItem("Municipalities", "sub1", <FaMountainCity />, [
    getItem("Option 1", "1"),
    getItem("Option 1", "1"),
    getItem("Option 1", "1"),
    getItem("View more", "1"),
  ]),
];

const SideBarMenu = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [municipalities, setMunicipalities] = useState<MunicipalityProps[] | null>();

  console.log(municipalities);
  

  const handleGetMunicipalities = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("data/municipalities");
      if (response.data) {
        setIsLoading(false);
        setMunicipalities(response.data)
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    handleGetMunicipalities();
  }, []);
  
  return (
    <Menu
      style={{
        width: "100%",
        marginTop: "5px",
        marginBottom: "5x",
        backgroundColor: "#fffcf2",
      }}
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      items={items}
    />
  );
};

export default SideBarMenu;
