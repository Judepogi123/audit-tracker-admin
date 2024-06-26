import React, { ReactNode } from "react";
import { Layout as MainLayout } from "antd";

interface LayoutProps {
  children?: ReactNode | ReactNode[];
  style?: React.CSSProperties | undefined;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement> | undefined;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement> | undefined;
  id?: string;
  className?: string
}

const Layout = ({
  children,
  style,
  onMouseEnter,
  onMouseLeave,
  id,
  className
}: LayoutProps) => {
  return (
    <MainLayout
    className={className}
      id={id}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
    >
      {children}
    </MainLayout>
  );
};

export default Layout;
