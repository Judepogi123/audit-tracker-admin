import React from 'react'

import Layout from '../../../components/Layout'

import { Typography } from 'antd'

const ModalArchiveArea = () => {
  return (
    <Layout style={{width: "100%", height: "auto",backgroundColor: "#fff" }}>
        <div>
            <Typography>Are you sure you want to acrhive this area?</Typography>
            <Typography>This action will make this area not visible to client user.</Typography>
        </div>
    </Layout>
  )
}

export default ModalArchiveArea