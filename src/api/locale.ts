import axios from "../../server/api/axios";

export const handleGetAllLocale = async (pageParam: string) => {
  console.log("Checked", pageParam);

  try {
    const response = await axios.get(`/data/all-locale`, {
      params: { pageParam },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    
    throw new Error(`${error}`);
  }
};

export const handleRemoveLocale = async(localeID: string)=>{
  try {
    const response = await axios.post(`/data/remove-locale`, {params : {localeID}})
    return response
  } catch (error) {
    throw new Error(`${error}`)
  }
}
