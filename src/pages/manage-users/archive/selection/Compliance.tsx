import { useState, useEffect } from "react";

//controller
import { useQuery } from "@tanstack/react-query";
import axios from "../../../../../server/api/axios";

//ui
import Layout from "../../../../components/Layout";
import { Typography } from "antd";
import Checkbox from "../../../../components/Checkbox";
import Spinner from "../../../../components/Spinner";
import { handleCheckString } from "../../../../utils/_list";

//interface
import { ComplianceDataProps } from "../../../../interface/compliance";

interface ComplianceListProps {
  handleRefetch: () => void;
  selectedList: (string | boolean)[];
  setSelectedList: React.Dispatch<React.SetStateAction<(string | boolean)[]>>;
  selectAll: boolean;
}

const Compliance = ({
  handleRefetch,
  selectedList,
  selectAll,
  setSelectedList,
}: ComplianceListProps) => {
  const [complianceList, setComplianceList] = useState<
    ComplianceDataProps[] | []
  >();
  const { data: complianceData, isLoading } = useQuery({
    queryKey: ["complianceData"],
    queryFn: () => axios.get(`/data/compliance`),
  });

  //   const { data: areaData, isLoading: areaIsLoading } = useQuery({
  //     queryKey: ["areaData"],
  //     queryFn: () => axios.get(`/data/compliance`),
  //   });

  useEffect(() => {
    if (complianceData?.data) {
      const data: ComplianceDataProps[] = complianceData.data;
      setComplianceList(data.filter((item) => item.archived === true));
      return;
    }
    setComplianceList([]);
  }, [complianceData?.data]);

  const handleStringList = (id: string) => {
    try {
      const valueCopy = [...selectedList];
      const matchedItem = valueCopy.findIndex((item) => item === id);

      if (matchedItem !== -1) {
        valueCopy[matchedItem] = false;
      } else {
        valueCopy.push(id);
      }
      setSelectedList(valueCopy.filter((item) => item !== false));
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const handleSelectAll = () => {
      if (!complianceList) return;
      if (selectAll) {
        const newCopy = [...complianceList];
        const stringList: string[] = newCopy.map((item) => item.pushKey);
        setSelectedList(stringList);
        return;
      }
      setSelectedList([]);
    };
    handleSelectAll();
  }, [selectAll]);

  return (
    <Layout style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "4px 8px",
          overflowY: "auto",
          gap: "8px",
        }}
      >
        {complianceList?.length === 0 ? (
          <Layout style={{ width: "100%", height: "100%", display: "grid", backgroundColor: "#fff" }}>
           <Typography
              style={{ margin: "auto", fontSize: "1.1rem", fontWeight: 600 }}
            >
              Empty
            </Typography>{" "}
          </Layout>
        ) : isLoading ? (
          <Layout style={{ width: "100%", height: "100%", display: "grid" }}>
            <div style={{ margin: "auto" }}>
              <Spinner />
            </div>
          </Layout>
        ) : (
          complianceList?.map((item) => (
            <Checkbox
              value={`${item.pushKey}#${item.zipCode}`}
              checked={handleCheckString(
                selectedList as string[],
                `${item.pushKey}#${item.zipCode}`
              )}
              onChange={(e) => handleStringList(e.target.value)}
              key={item.pushKey}
              className="areaItem"
              style={{
                width: "100%",
                padding: "8px 16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                display: "flex",
                cursor: "pointer",
              }}
            >
              <div style={{ marginLeft: "16px" }}>
                <Typography style={{ fontWeight: 500, fontSize: "1.1rem" }}>
                  {item.title}
                </Typography>
              </div>
            </Checkbox>
          ))
        )}
      </div>
    </Layout>
  );
};

export default Compliance;
