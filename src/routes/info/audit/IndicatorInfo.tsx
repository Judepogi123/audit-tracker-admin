import {useEffect, useState} from "react";

import { useParams } from "react-router-dom";
import axios from "../../../../server/api/axios";

import Layout from "../../../components/Layout";

  interface ValueProps {
    title: string;
    key: string;
  }

interface IndicatorsProps {
    dataInputMethod: {
      type: null | string;
      value: ValueProps[] | string | number;
    };
    query: string;
    id: string;
    mov: string;
    movDueDate: string | undefined | "null";
    title: string;
    type: "indicator" | "subIndicator";
    subIndicator?: IndicatorsProps[];
    stage: number;
    status: boolean;
  }
  

const IndicatorInfo = () => {
    const [indicator, setIndicator] = useState<IndicatorsProps | null>(null)
    const [error, setErorr] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

  const { fieldID,indicatorID } = useParams();

  const handleGetIndicator = async()=>{
    setIsLoading(true)
    try {
        const response =await axios.get(`/data/indicator`,{
            params: {
                fieldID: fieldID,
                
            }
        })
        if(response.data){
            const data = response.data
            setIndicator(data)
        }
    } catch (error) {
        console.log(error);
    }finally{
        setIsLoading(false)
    }
  }

  useEffect(()=>{

  },[])

  return (
    <Layout
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    ></Layout>
  );
};

export default IndicatorInfo;
