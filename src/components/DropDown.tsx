import React from "react";
import { Dropdown as GenDropDown } from "antd";
import type { MenuProps } from "antd";

interface DropdownProps {
  menu?: MenuProps["items"] | undefined;
  placement:
    | "topLeft"
    | "topCenter"
    | "topRight"
    | "bottomLeft"
    | "bottomCenter"
    | "bottomRight"
    | "top"
    | "bottom"
    | undefined;
    children: React.ReactNode
}



const DropDown = ({ menu, placement,children }: DropdownProps) => {
  return (
    <GenDropDown menu={menu as MenuProps} placement={placement} arrow>
        {children}
    </GenDropDown>
  );
};

export default DropDown;
