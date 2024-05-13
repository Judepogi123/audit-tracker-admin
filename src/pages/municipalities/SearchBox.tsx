import React from 'react'

import Layout from '../../components/Layout'
import Input from '../../components/Input'

const SearchBox = () => {
  return (
    <Layout style={{width: "100%", height: "auto"}}>
        <div>
            <Input size={'small'} placeholder={'Type locale name'} variant={undefined}/>
        </div>
    </Layout>
  )
}

export default SearchBox