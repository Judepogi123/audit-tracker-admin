import React from 'react'

import Layout from '../../../components/Layout'

import { Typography } from 'antd'

const ModalLockArea = () => {
  return (
    <Layout style={{width: "100%", height: "auto",backgroundColor: "#fff" }}>
        <div>
            <Typography>Are you sure you want to loke this area?</Typography>
            <Typography>This action will not let the client user to answer/save draft/submit compliance for this area.</Typography>
        </div>
    </Layout>
  )
}

export default ModalLockArea