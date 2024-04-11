import React from 'react'
import { Checkbox as GenCheckbox} from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox';

interface CheckboxProps {
     disabled?: boolean;
     children?: React.ReactNode
     value?: boolean | string
     onChange?: ((e: CheckboxChangeEvent) => void) | undefined
}

const Checkbox = ({disabled, children,value,onChange}: CheckboxProps) => {
  return (
    <GenCheckbox onChange={onChange} value={value} disabled={disabled}>{children}</GenCheckbox>
  )
}

export default Checkbox