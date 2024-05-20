import { UserProps } from "../interface/manage";
import { handleGetUserInfo } from "../provider/UserDataProvider";

export const handleGetUserList = async(value: string)=>{
    try {
        const list: string[] = JSON.parse(value)
        const allUserList = list.map(async(item)=> await handleGetUserInfo(item))
        const awaitedData = await Promise.all(allUserList)
        return {data : awaitedData, status: "success"}
    } catch (error) {
        return {data: "Unknown error", status: "error"}
    }
}

export const handleStringList = (value: string[] | boolean[], id: string)=>{
    try {
        const valueCopy = [... value]
        const matchedItem = valueCopy.findIndex((item)=> item === id)

        if(matchedItem !== -1){
            valueCopy[matchedItem] = false
        }else{
            valueCopy.push(id)
        }
        return valueCopy
    } catch (error) {
        return false
    }
}

export const handleCheckString = (args: string[], data: string)=>{
    try {
        const valueCopy = [... args]
        const matchedItem = valueCopy.findIndex((item)=> item === data)

        if(matchedItem !== -1){
            return true
        }
        return false
    } catch (error) {
        return false
    }
}