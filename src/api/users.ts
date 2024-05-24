import axios from "../../server/api/axios";

export const handleFetchUser = async (pageParam: string) => {
    
    const response = await axios.get("/data/users", {
      params: {
        pageParam,
      },
    });
    return response.data;
  }

export const handleArchiveUser = async(username: string,status: boolean) =>{
  try {
    const request = await axios.post(`/data/archive-user`, {username,status})
    return request
  } catch (error) {
    throw new Error(`${error}`)
  }
}