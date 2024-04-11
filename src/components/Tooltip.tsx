import React, { Children } from "react";
import { Tooltip as GenToolTip } from "antd";

interface TooltipProps {
  children: React.ReactNode;
  enterDelay?: number;
  title?: string;
}

const Tooltip = ({ children, enterDelay, title }: TooltipProps) => {
  return (
    <GenToolTip title={title} mouseEnterDelay={enterDelay}>
      {children}
    </GenToolTip>
  );
};

export default Tooltip;
