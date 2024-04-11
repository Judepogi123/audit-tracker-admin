import express from "express";
import { database } from "../../firebase/dbConfig.js";
import { get, ref, onValue } from "../../firebase/dbConfig.js";


const router = express.Router()

router.get("/municipalities", async(req, res)=> {
    try {
        const dataRef = ref(database, `Municipalities`)
        const getData = onValue(dataRef, async(snapshot)=>{
            if(snapshot.val()){
                res.status(200).json([snapshot.val()])
                return
            }
            else{
                res.status(200).json({messsage: "No Municipalities found"})
            }
        })
        return ()=> getData()
    } catch (error) {
        
    }
})

export default router