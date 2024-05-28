import React from "react";
import "./style.scss";

//ui
import Layout from "../components/Layout";
import { Typography, Row, Col } from "antd";

//icons
import { BsLayerForward } from "react-icons/bs";
import { MdManageAccounts } from "react-icons/md";
import { FaBook } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaMountainCity } from "react-icons/fa6";

//controllers
import { useNavigate } from "react-router-dom";

interface SideBarProps {
  icon?: React.ReactNode;
  title?: string;
  jsxElement?: React.ReactNode;
  value: string;
}

const iconColor = "#343a40";
const fontSize = 30;

const menuList: SideBarProps[] = [
  {
    title: "Compliance",
    value: "/compliance",
    icon: <BsLayerForward fontSize={fontSize} color={iconColor} />,
  },
  {
    title: "Locale",
    value: "/municipalities",
    icon: <FaMountainCity fontSize={fontSize} color={iconColor} />,
  },
  {
    title: "Manage",
    value: "/manage",
    icon: <MdManageAccounts fontSize={fontSize} color={iconColor} />,
  },
  {
    title: "About",
    value: "/about",
    icon: <FaInfoCircle fontSize={fontSize} color={iconColor} />,
  },
];
const LandingPage = () => {
  const navigate = useNavigate();

  const hanldeChangePage = (value: string) => {
    try {
      navigate(value);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout
      style={{
        width: "100%",
        height: "100%",
        padding: "32px",
        backgroundColor: "#fff",
      }}
    >
      <Row style={{ gap: "8px" }}>
        {menuList.map((item, i) => (
          <Col span={6} key={i} style={{ borderRadius: "8px" }}>
            <div
              onClick={() => hanldeChangePage(item.value)}
              className="menuItem"
              style={{
                width: "100%",
                height: "100px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                display: "flex",
                padding: "16px",
                gap: "16px",
                backgroundColor: "#fffcf2",
              }}
            >
              <div style={{ display: "flex", alignItems: "center",gap: "16px",}}>
                <>{item.icon}</>
                <Typography style={{ fontWeight: 600, fontSize: "1.4rem" }}>
                  {item.title}
                </Typography>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Layout>
  );
};

export default LandingPage;
