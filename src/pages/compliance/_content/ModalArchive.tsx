import React from 'react'
import Layout from '../../../components/Layout'
import { Typography } from 'antd'

const ModalArchive = () => {
  return (
    <Layout style={{ width: "100%", height: "auto", backgroundColor: "#fff" }}>
      <Typography.Paragraph>
        Confirm action?

        This compliance will not be visible to compliance list.
      </Typography.Paragraph>
    </Layout>
  )
}

export default ModalArchive