interface MunicipalitiesProps {
  municipalityName: string;
  zipCode: number;
}

import { OptionProps } from "antd/es/select";

export const handleManString = (value: string, data: string, index: number) => {
    console.log("value", value);
    console.log("data", data);
    console.log("index", index);
  
    const temp: string[] | undefined = value.split(":");
  
    if (index === 1) {   
      const newTemp = temp[0] + ":" + (temp[index] = data) + ":" + temp[2]
      console.log("result", newTemp);
      return newTemp.toString();
    }else if (index === 2) {  
      console.log("Not");
        
      const newTemp = temp[0] + ":" + temp[1]  + ":" + (temp[index] = data)
      console.log("result", newTemp);
      return newTemp;
    }
    else {
      console.log("Sorry, can't modified the indicator type.");
      return;
    }
  };

export const handleGetValueLabel = (args: MunicipalitiesProps[])=>{
  if(!args || !Array.isArray(args))return
  let temp: {value: number, label: string}[] = []

  for(let item of args){
    const newItem: {value: number, label: string}={
      value: item.zipCode,
      label: item.municipalityName
    }
    temp.push(newItem)
  }

  return temp
}