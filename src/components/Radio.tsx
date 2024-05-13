import React from 'react'
import { Radio as GenRadio } from 'antd'

interface RadioProps {
  disabled?: boolean;
  children: React.ReactNode;
  value: string;
  style?: React.CSSProperties | undefined
}

const Radio = ({disabled, children,value,style}: RadioProps) => {
  return (
    <GenRadio style={style} disabled={disabled} value={value}>{children}</GenRadio>
  )
}

export default Radio