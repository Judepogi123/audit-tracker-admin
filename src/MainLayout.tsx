import React from "react";
import { Layout } from "antd";
import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Header from "./header/Header";
import App from "./App";
import "./style.css";

const routes = createBrowserRouter([
  {
    path: "/home",
    element: <App />,
  },
]);

const MainLayout = () => {
  return (
    <Layout
      style={{
        width: "100%",
        height: "100dvh",
        margin: 0,
        padding: 0,
      }}
    >
      <Header />
      <main>
      </main>
    </Layout>
  );
};

export default MainLayout;
