import React from 'react'
import { Checkbox as GenCheckbox} from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox';

interface CheckboxProps {
     disabled?: boolean;
     children?: React.ReactNode
     value?: boolean | string
     onChange?: ((e: CheckboxChangeEvent) => void) | undefined;
     style?: React.CSSProperties | undefined;
     checked?: boolean;
}

const Checkbox = ({disabled, children,value,onChange,style,checked}: CheckboxProps) => {
  return (
    <GenCheckbox checked={checked} style={style} onChange={onChange} value={value} disabled={disabled}>{children}</GenCheckbox>
  )
}

export default Checkbox