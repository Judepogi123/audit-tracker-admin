import {useEffect,useState} from 'react';
import axios from '../../../server/api/axios';
import Layout from '../../components/Layout';
import Select from '../../components/Select';

import { useQuery } from '@tanstack/react-query';

const KeySelection = () => {

    const {} = useQuery({
        queryKey: ["keyList"],
        queryFn: ()=>axios.get("/data/key-list")
    })
    
    useEffect(()=>{
        try {
            
        } catch (error) {
            
        }
    },[])

    
  return (
    <Select options={[{label: "0", value: "0"}]} size={undefined}/>
  )
}

export default KeySelection