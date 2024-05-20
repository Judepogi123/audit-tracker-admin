import axios from "../../server/api/axios";
import { UserProps } from "../interface/manage";


export const handleGetUserInfo = async (
  username: string
): Promise<UserProps> => {
  try {
    const response = await axios.get(`auth/user-data?username=${username}`);
    return response.data;
  } catch (error) {
    throw new Error(`Sorry something went wrong "Jude": ${error}`);
  }
};


