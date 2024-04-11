import React from 'react';
import { Radio } from 'antd';

const {Button,} = Radio

 interface RadioProps {
    value?: string | number;
    children: React.ReactNode | string;
    style?: React.CSSProperties | undefined
 }

const RadioButton = ({value, children,style}: RadioProps) => {
  return (
    <Button style={style} value={value}>{children}</Button>
  )
}

export default RadioButton