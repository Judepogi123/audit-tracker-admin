import React from 'react'
import { Spin } from 'antd'

interface SpinProps {
    tip?: string;
    size?: "small" | "large" | "default" | undefined;
    spinning?: boolean
    style?: React.CSSProperties | undefined
}

const Spinner = ({tip, size, spinning,style}: SpinProps) => {
  return (
    <Spin style={style} tip={tip} size={size} spinning={spinning}/>
  )
}

export default Spinner