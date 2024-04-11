import React, { useState } from "react";
import { Modal as GenModal, ButtonProps } from "antd";

import Button from "./Button";

type ToogleType = true | false;

interface ModalProps {
  children: React.ReactNode;
  openModal: ToogleType;
  setCloseModal:
    | ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined;
  onFunction?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  width?: number;
  title?: string;
  loading?: boolean;
  style?: React.CSSProperties | undefined;
  cancelHid?: boolean | undefined;
  okHid?: boolean | undefined
}

const Modal = ({
  children,
  openModal,
  setCloseModal,
  onFunction,
  width,
  title,
  loading,
  style,
  cancelHid,
  okHid
}: ModalProps) => {
  return (
    <GenModal
    style={style}
    closeIcon={false}
    okText="Confirm"
      width={width}
      open={openModal}
      onOk={onFunction}
      onCancel={setCloseModal}
      title={title}
      cancelButtonProps={{
        loading: loading,
        hidden: cancelHid,
      }}
      okButtonProps={{
        loading: loading,
        type: "primary",
        children: "Yes",
        style: { backgroundColor: "#1982c4" },
        hidden: okHid
      }}    >
      {children}
    </GenModal>
  );
};

export default Modal;
