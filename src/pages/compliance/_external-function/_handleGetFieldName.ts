import { AreaProps,LocaleListProps } from "../../../interface/compliance";

export const hanldeSearchItem = (id: string, temp: AreaProps[]| undefined) => {
  if (!Array.isArray(temp)) return;

  const tempCopy = [...temp]

  const matchedId = tempCopy.findIndex((item)=> item.pushKey === id)
  if(matchedId !== -1){
    return tempCopy[matchedId].title
  }else{
    return "Unknown Area"
  }
};

export const handleSearchName = (code: string, temp: LocaleListProps[] | undefined) => {
  if (!Array.isArray(temp)) return;  
  const tempCopy = [...temp]
  
  const matchedCode = tempCopy.findIndex((item)=> `${item.zipCode}` === code)
  if(matchedCode !== -1){
    return tempCopy[matchedCode].municipalityName
  }else{
    return "Unknown Locale"
  }

};
