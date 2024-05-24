//ui
import Spinner from "./Spinner";
import Layout from "./Layout";
import Lottie from "lottie-react";
import { Typography } from "antd";

import loading1 from "../assets/animations/Animation - 1713050354730.json";

interface LoadingProps {
  type: "classic" | "loading1" | "loading2";
}

const Loading = ({ type }: LoadingProps) => {
  const loadingMessage = "Loading, please wait...";

  const handleRenderLoading = () => {
    switch (type) {
      case "classic":
        return (
          <Layout
            style={{
              width: "100%",
              height: "auto",
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
              padding: "16px",
              backgroundColor: "#fff"
            }}
          >
            <Spinner />
            <Typography>{loadingMessage}</Typography>
          </Layout>
        );
      case "loading1":
        return (
          <Layout
            style={{
              width: "100%",
              height: "auto",
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
              padding: "16px",
              backgroundColor: "#fff"
            }}
          >
            <Lottie width={150} animationData={loading1} />
            <Typography>{loadingMessage}</Typography>
          </Layout>
        );
    }
  };
  return handleRenderLoading();
};

export default Loading;
