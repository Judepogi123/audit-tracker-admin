import { useDebounce,useDebouncedCallback } from "use-debounce";

interface IndicatorsProps {
  dataInputMethod: {
    type: null | string;
    value: string;
  };
  query: string;
  key: string;
  mov: string;
  movDueDate: string | undefined | "null";
  title: string;
  type: "indicator" | "subIndicator";
  subIndicator?: IndicatorsProps[];
  stage: number;
  status: boolean;
  marked: boolean
}

export const convertToArrays = (data: IndicatorsProps[]) => {
  
  return Object.values(data).map((item) => {
    // Convert indicator dataInputMethod value to array
    if (item.type === 'indicator' && item.dataInputMethod && item.dataInputMethod.value) {
      item.dataInputMethod.value = JSON.parse(item.dataInputMethod.value);
    }
    // Convert subIndicator dataInputMethod values to arrays
    if (item.subIndicator) {
      item.subIndicator = Object.values(item.subIndicator).map((subItem) => {
        if (subItem.dataInputMethod && subItem.dataInputMethod.value) {
          subItem.dataInputMethod.value = JSON.parse(subItem.dataInputMethod.value);
        }
        // Convert sub-subIndicator dataInputMethod values to arrays if they exist
        if (subItem.subIndicator) {
          subItem.subIndicator = Object.values(subItem.subIndicator).map((innerSubItem) => {
            if (innerSubItem.dataInputMethod && innerSubItem.dataInputMethod.value) {
              innerSubItem.dataInputMethod.value = JSON.parse(innerSubItem.dataInputMethod.value);
            }
            return innerSubItem;
          });
        }
        return subItem;
      });
    }
    return item;
  });
};


export const handleEditText = (value: string, time: number)=>{
  const [text] = useDebounce(value, time)
  return text
}