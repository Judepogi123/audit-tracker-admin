import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "../../../../server/api/axios";

import Select from "../../../components/Select";
import Layout from "../../../components/Layout";
import { Typography } from "antd";

import { LocaleProps } from "../../../interface/locale";

interface OptionProps {
  value: string | number;
  label: string;
  disabled?: boolean;
}


function Municipal({}) {
  const [lcoaleList, setLocaleList] = useState<OptionProps[] | []>();
  const { data: localeData, isError } = useQuery({
    queryKey: ["lacaleData"],
    queryFn: () => axios.get(`/data/municipalities`),
  });

  useEffect(() => {
    const handleSelectItem = () => {
        if(!localeData?.data)return
      try {
        let temp: OptionProps[] = [];
        const allLocale: LocaleProps[] = Object.values(
          localeData.data as LocaleProps[]
        ).filter((item) => item.type === "municipal");
        for (let item of allLocale) {
          temp.push({ value: item.zipCode, label: item.municipalityName });
        }
        setLocaleList(temp);
      } catch (error) {
        console.log(error);
      }
    };
    handleSelectItem();
  }, [localeData?.data]);

  if (!localeData?.data) {
    <Typography>Sorry something went wrong</Typography>;
    return;
  }
  return <Select options={lcoaleList as OptionProps[]} size={undefined} />;
}

export default Municipal;
