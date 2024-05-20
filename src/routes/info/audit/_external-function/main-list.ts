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
  }

export const handleSearchItem = (indicator: IndicatorsProps[])=>{
    try {
      const temp= ""
    } catch (error) {
        console.log(error);
        
    }
}