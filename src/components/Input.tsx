import React from "react";
import { Input as GenInput } from "antd";
import { InputRef, PasswordProps } from "antd/es/input";

// Import the SizeType type from Ant Design

type InputSize = "large" | "defaultSize" | "small";
type VariantType = "outlined" | "borderless" | "filled" | undefined;

type InputProps = {
  size: InputSize;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
  variant: VariantType;
  suffix?: React.ReactNode;
  style?: React.CSSProperties | undefined;
  value?: string | number;
  disabled?: boolean,
  name?: string
  type?:string;
  accept?: string
};

export default function Input({
  size,
  onChange,
  placeholder,
  variant,
  suffix,
  style,
  value,
  disabled,
  name,type,
  accept
}: InputProps) {
  return (
    <GenInput
    accept={accept}
    type={type}
    disabled={disabled}
      value={value}
      style={style}
      suffix={suffix}
      variant={variant}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
    />
  );
}
