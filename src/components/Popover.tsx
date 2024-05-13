import React, { ReactNode } from "react";
import { Popover as GenPopover } from "antd";

interface PopoverProps {
  children: React.ReactNode;
  title?: string;
  content: React.ReactNode;
  open?: boolean;
  trigger?: "click" | "hover" | undefined;
  onOpenChange?: ((visible: boolean) => void) | undefined;
  placement?:
    | "top"
    | "topLeft"
    | "topRight"
    | "leftTop"
    | "left"
    | "leftBottom"
    | "rightTop"
    | "right"
    | "rightBottom"
    | "bottomLeft"
    | "bottom"
    | "bottomRight"
    | undefined;
    style?: React.CSSProperties | undefined
}

const Popover = ({
  children,
  title,
  content,
  open,
  trigger,
  onOpenChange,
  placement,
  style
}: PopoverProps) => {
  return (
    <GenPopover
    
    style={style}
      placement={placement}
      onOpenChange={onOpenChange}
      trigger={trigger}
      title={title}
      content={content}
      open={open}
    >
      {children}
    </GenPopover>
  );
};

export default Popover;
