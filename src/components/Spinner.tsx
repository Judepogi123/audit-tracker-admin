import React from 'react'
import { Spin } from 'antd'

interface SpinProps {
    tip?: string;
    size?: "small" | "large" | "default" | undefined;
    spinning?: boolean
}

const Spinner = ({tip, size, spinning}: SpinProps) => {
  return (
    <Spin tip={tip} size={size} spinning={spinning}/>
  )
}

export default Spinner