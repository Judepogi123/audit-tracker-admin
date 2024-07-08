import { FloatButton } from "antd"
import { FloatButtonElement } from "antd/es/float-button/interface"
import { Children } from "react";

//interface
interface FloatButtonProps {
    onClick?: React.MouseEventHandler<FloatButtonElement> | undefined
    style?: React.CSSProperties | undefined;
    children: React.ReactNode
}

const FloatingButton = ({onClick, style,children}:FloatButtonProps) => {
  return (
    <FloatButton onClick={onClick} style={style}>{children}</FloatButton>
  )
}

export default FloatingButton