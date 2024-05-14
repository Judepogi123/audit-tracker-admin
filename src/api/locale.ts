import axios from "../../server/api/axios";

export const handleGetAllLocale = async (pageParams: number) => {
  const response = await axios.get(`/data/locale`,{params: {page: pageParams}});
  if (response.status === 200) {
    return response.data;
  }
  return "Sorry something went wrong";
};
