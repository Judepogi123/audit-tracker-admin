import React from 'react';
import { Input as GenInput } from 'antd';
import { InputRef, PasswordProps } from 'antd/es/input';

// Import the SizeType type from Ant Design

type InputSize = "large" | "defaultSize" | "small";

type InputProps = {
  size: InputSize;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder: string
  Password?:  React.ForwardRefExoticComponent<PasswordProps & React.RefAttributes<InputRef>>
  iconRender?: (visible: boolean)=> React.ReactNode
};

export default function InputPassword({ size, onChange, placeholder, Password, iconRender }: InputProps) {
  return (
    <GenInput.Password iconRender={iconRender} onChange={onChange} placeholder={placeholder} />
  );
}
