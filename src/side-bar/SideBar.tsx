import React, { useEffect, useState } from "react";
import { Layout, Typography } from "antd";
import { BsLayerForward } from "react-icons/bs";
import { MdManageAccounts } from "react-icons/md";
import { FaBook } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaMountainCity } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import { useSystemData } from "../provider/SystemDataProvider";
import axios from "../../server/api/axios";
import "./style.scss";

interface SideBarProps {
  icon?: React.ReactNode;
  title?: string;
  jsxElement?: React.ReactNode;
  path: string;
}

const mainSideBarMenu: SideBarProps[] = [
  {
    title: "Dashboard",
    icon: <MdDashboard color="#343a40" />,
    path: "/dashboard",
  },
  {
    title: "Compliance",
    icon: <BsLayerForward color="#343a40" />,
    path: "/compliance",
  },
  {
    title: "Locale",
    icon: <FaMountainCity color="#343a40" />,
    path: "/municipalities",
  },
  {
    title: "Manage",
    icon: <MdManageAccounts color="#343a40" />,
    path: "/manage",
  },
  {
    title: "User Manual",
    icon: <FaBook color="#343a40" />,
    path: "/user-manual",
  },
  { title: "About", icon: <FaInfoCircle color="#343a40" />, path: "/about" },
];

const SideBar = () => {
  const [selectedPath, setSelectedPath] = useState<string>(() => {
    // Initialize selectedPath from sessionStorage, or default to "/dashboard"
    return sessionStorage.getItem("selectedPath") || "/dashboard";
  });
  const navigate = useNavigate();

  const handleNavigatePath = async (path: string) => {
    try {
      if(selectedPath === path){
        return
      }
      setSelectedPath(path);
      navigate(path);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    sessionStorage.setItem("selectedPath", selectedPath);
  }, [selectedPath]);

  return (
    <Layout style={{ width: "100%", height: "100%", backgroundColor: "#fffcf2" }}>
      <div className="side-bar-content">
        {mainSideBarMenu.map((item) => (
          <div
            style={{
              backgroundColor: selectedPath === item.path ? "#ade8f4" : "",
              borderRadius: "30px",
            }}
            key={item.title}
            onClick={() => handleNavigatePath(item.path)}
          >
            <div style={{ display: "flex", gap: "10px" }} className="side-bar-item">
              <>{item.icon}</>
              <Typography.Text
                className="side-bar-font"
                style={{
                  color: "#201e1f",
                }}
              >
                {item.title}
              </Typography.Text>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default SideBar;
