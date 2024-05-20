import { Outlet } from "react-router-dom";
import "./style.css";

import { Layout } from "antd";

import SideBar from "../side-bar/SideBar";
import Header from "../header/Header";


const Home = () => {
  
  return (
    <Layout style={{ widows: "100%", height: "100dvh", display: "flex", position: "relative" }}>
      <main className="main-container">
        <div className="header-container">
            <Header />
        </div>
        <div className="content-container">
          <div
            style={{ width: "15%", height: "100%" }}
            className="side-bar-container"
          >
            <SideBar />
          </div>
          <div
            style={{ width: "85%", height: "100%" }}
            className="render-routes"
          >

            <Outlet />
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Home;
