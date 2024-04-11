import React from 'react'
import { Radio as GenRadio } from 'antd'

interface RadioProps {
  disabled?: boolean;
  children: React.ReactNode;
  value: string;
}

const Radio = ({disabled, children,value}: RadioProps) => {
  return (
    <GenRadio disabled={disabled} value={value}>{children}</GenRadio>
  )
}

export default Radio