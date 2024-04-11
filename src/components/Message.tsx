import React from 'react'
import { message, Space } from 'antd';

type TypeProps = "success" | "error" | "warning"

interface MessageProps {
    type: TypeProps;
    content: string
}

const [messageApi, contextHolder] = message.useMessage();



const Message = ({type, content}: MessageProps) => {
    const [messageApi, contextHolder] = message.useMessage();
  return (
    messageApi.open({
        type: type,
        content: content,
      })
  )
}

export default Message