import {createContext, useState, useEffect} from 'react'
import axios from 'axios'
import { message } from 'antd'

interface NetworkProps {
    children: React.ReactNode
}

const NetworkStatus = () => {
    const [network, setNetwork] = useState<number>()
    const [messageApi, contextMessage] = message.useMessage()

    const handleGetNetwork = async()=>{
        try {
            const request = await axios.get("audit-tracker-d4e91.firebaseapp.com")
            console.log(request.status);
            if (navigator.onLine) {
                console.log("Device is connected to the internet.");
            } else {
                console.log("Device is NOT connected to the internet.");
            }
            
        } catch (error) {
            messageApi.error(`Internal server error: ${error}`)
        }
    }

    useEffect(()=>{
        handleGetNetwork()
    })
  return (
    <div></div>
  )
}

export default NetworkStatus