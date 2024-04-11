import React, { Children } from "react";
import { Result } from "antd";
import { ResultStatusType } from "antd/es/result";

interface ResultProps {
  status: ResultStatusType | undefined;
  title?: string;
  subTitle?: string;
  extra?: React.ReactNode | React.ReactNode[];
  children?: React.ReactNode;
  style?: React.CSSProperties | undefined;
}

const Rsults = ({
  status,
  title,
  subTitle,
  extra,
  children,
  style,
}: ResultProps) => {
  return (
    <Result
      style={style}
      status={status}
      title={title}
      subTitle={subTitle}
      extra={extra}
    >
      {children}
    </Result>
  );
};

export default Rsults;
