import express from "express";
import { database } from "../../../firebase/dbConfig.js";
import { get, ref } from "../../../firebase/dbConfig.js";
const router = express.Router()

const handleGetAllCompliance = (data)=>{
    let complianceList = []
    try {
        const temp = Object.values(data)
        for(let tempData of temp){
            if(!tempData)return
            for(let compliance of Object.values(tempData)){
                complianceList.push(compliance)
            }
        }
        return complianceList
    } catch (error) {
        console.log(error);
    }
}

router.get("/compliance", async(req, res)=>{
    try {
        const complianceRef = ref(database, `Compliance`)
        const snapshot = await get(complianceRef)
        if(snapshot.exists()){
            const data = handleGetAllCompliance(snapshot.val())
            res.status(200).json(data)
        }else{
            res.status(200).json({message: "No compliance found!", error: "error"})
        }
    } catch (error) {
        res.status(500).json({message: `Sorry, something went wrong: ${error}`, status: "error"})
    }
})

export default router