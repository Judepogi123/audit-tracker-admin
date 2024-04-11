import { Button as GenButton } from "antd";
import React, { ReactElement } from "react";

type ButtonType = "primary" | "dashed" | "link" | "text";

interface ButtonProps  {
  htmlType?: "button" | "submit" | "reset";
  type?: ButtonType;
  children: React.ReactNode;
  onClick?: (event?: React.MouseEvent<HTMLElement, MouseEvent>)=> void;
  icon?: React.ReactNode
  style?: React.CSSProperties;
  disabled?: boolean
  loading?: boolean
};

const Button = ({ htmlType, type, children,icon, style,onClick, disabled,loading}: ButtonProps) => {
  return (
    <GenButton
    loading={loading}
    disabled={disabled}
    onClick={onClick}
    htmlType={htmlType}
      type={type}
      icon={icon}
      style={style}
    >
      {children}
    </GenButton>
  );
};

export default Button;
