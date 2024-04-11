import React from 'react'
import { Input } from 'antd';

const { TextArea } = Input;

interface TextAreaProps {
    placeholder?: string;
    row?: number;
    style?: React.CSSProperties | undefined;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement> | undefined;
    value?:  string | number | bigint | readonly string[] | undefined
}

const Textarea = ({placeholder, row, style, onChange,value}: TextAreaProps) => {
  return (
    <TextArea value={value} onChange={onChange} style={style} placeholder={placeholder} rows={row}></TextArea>
  )
}

export default Textarea