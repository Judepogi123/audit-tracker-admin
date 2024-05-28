import { Outlet, useSearchParams, useNavigate} from "react-router-dom";
import { useState } from "react";
import "./style.css";

import { Layout } from "antd";

import SideBar from "../side-bar/SideBar";
import Header from "../header/Header";
import LandingPage from "./LandingPage";

//pages
import Dashboard from "../pages/dashboard/Dashboard";
import Municipalities from "../pages/municipalities/Municipalities";
import ManageUsers from "../pages/manage-users/Manage";
import About from "../pages/about/About";
import ComplianceList from "../pages/compliance/ComplianceList";

const Home = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams({
    page: "/dashboard",
  });
  const currentPage = searchParams.get("page");

  const handleRenderLayout = () => {
    switch (currentPage) {
      case "/dasboard":
        return <Dashboard />;
      case "/compliance":
        return <ComplianceList />;
      case "/municipalities":
        return <Municipalities />;
    }
  };

  return (
    <Layout
      style={{
        widows: "100%",
        height: "100dvh",
        display: "flex",
        position: "relative",
        backgroundColor: "#fff"
      }}
    >
      <main className="main-container">
        <div className="header-container">
          <Header />
        </div>
        <div className="content-container">
        <Outlet />
          {/* <div
            style={{ width: "15%", height: "100%" }}
            className="side-bar-container"
          >
            <SideBar currentPage={currentPage} hanldeChangePage={hanldeChangePage} />
          </div>
          <div
            style={{ width: "85%", height: "100%" }}
            className="render-routes"
          >
          
            {handleRenderLayout()}
          </div> */}
        </div>
      </main>
    </Layout>
  );
};

export default Home;
