//controller
import { useNavigate, useParams } from "react-router-dom";

//ui
import Layout from "../../../../../components/Layout";
import { Typography } from "antd";
import Rsults from "../../../../../components/Rsults";
import Button from "../../../../../components/Button";
import { FieldProps } from "../../../../../interface/manage";

interface ResultProps {
  link: string
  setResult: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Result = ({ setResult,link }: ResultProps) => {
    
  const navigate = useNavigate();

  return (
    <Layout style={{backgroundColor: "#fff"}}>
      <Rsults
        style={{
          width: "600px",
          height: "400px",
          backgroundColor: "#fff",
          borderRadius: "5px",
          textAlign: "center",
          lineHeight: "100px",
        }}
        status={"success"}
        title={`Successfully.`}
        subTitle="You can now view the area to the Audit info."
        extra={[
          <Button
            onClick={() => {
              navigate(link);
              setResult(undefined);
            }}
          >
            Back to the field list
          </Button>,
        ]}
      />
    </Layout>
  );
};

export default Result;
