import express from "express"
import {database, update, ref} from "../../../firebase/dbConfig.js"
import { message } from "antd"


const router = express.Router()

router.post("/archive-area", async(req,res)=>{
    const request = req.body
    console.log(request);
    try {
        const dataRef = ref(database, `System/auditInfo/fields/${request.pushKey}`)
        await update(dataRef, {
            archived: true
        })
        res.status(200).json({message: `Success`})
    } catch (error) {
        res.status(500).json({message: `Internal server error: ${error}`})
    }
})

router.post("/lock-area", async(req,res)=>{
    const request = req.body
    console.log(request);
    try {
        const dataRef = ref(database, `System/auditInfo/fields/${request.pushKey}`)
        await update(dataRef, {
            locked: !request.status
        })
        res.status(200).json({message: `Success`})
    } catch (error) {
        res.status(500).json({message: `Internal server error: ${error}`})
    }
})

export default router