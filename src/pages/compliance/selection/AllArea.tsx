import { useEffect, useState } from "react";

//ui
import Select from "../../../components/Select";

//controller

//utils

//interface
import { AreaProps, OptionProps } from "../../../interface/compliance";
import { handleGetLocal } from "../../../utils/localStorage";

interface AllAreaProps {
  currentAudit: string | null;
  currentArea: string | null;
  handleChangeArea: (value: string) => void;
}
const AllArea = ({
  currentAudit,
  currentArea,
  handleChangeArea,
}: AllAreaProps) => {
  const [areas, setAreas] = useState<OptionProps[]>();

  const areaList = localStorage.getItem("areasList");

  useEffect(() => {
    const list: AreaProps[] = areaList ? JSON.parse(areaList as string) : [];
    let temp: { label: string; value: string; majorID?: string }[] = [
      { label: "All", value: "all" },
    ];
    for (let item of list) {
      temp.push({
        value: item.pushKey,
        label: item.title,
        majorID: item.auditKey,
      });
    }
    setAreas(temp);
  }, [areaList]);
  
  
  
  return (
    <>
      {areas && (
        <Select
        placeholder="Select"
        value={currentArea || "all"}
          onChange={handleChangeArea}
          defaultValue={"all"}
          style={{ width: "200px" }}
          options={areas.filter(
            (item) => item.value === "all" || item.majorID === currentAudit
          )}
          size={undefined}
        />
      )}
    </>
  );
};

export default AllArea;
