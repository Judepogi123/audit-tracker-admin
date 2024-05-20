import React from "react";
import { Checkbox as GenCheckbox } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";

interface CheckboxProps {
  disabled?: boolean;
  children?: React.ReactNode;
  value?: boolean | string;
  onChange?: ((e: CheckboxChangeEvent) => void) | undefined;
  style?: React.CSSProperties | undefined;
  checked?: boolean;
  className?: string;
}

const Checkbox = ({
  disabled,
  children,
  value,
  onChange,
  style,
  checked,
  className
}: CheckboxProps) => {
  return (
    <GenCheckbox
    className={className}
      checked={checked}
      style={style}
      onChange={onChange}
      value={value}
      disabled={disabled}
    >
      {children}
    </GenCheckbox>
  );
};

export default Checkbox;
