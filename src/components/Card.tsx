import React, { ReactNode } from "react";
import { Card as GenCard } from "antd";

const Card = ({ children }: { children: ReactNode }) => {
  return <GenCard>{children}</GenCard>;
};

export default Card;
