import React from "react";
import { ToastContainer, ToastTransition, toast } from "react-toastify";

interface ToastProps {
  position:
    | "top-left"
    | "top-right"
    | "top-center"
    | "bottom-left"
    | "bottom-right"
    | "bottom-center"
    | undefined;
  autoClose?: number;
  hideProgressBar?: boolean;
  newestOnTop?: boolean | undefined;
  closeOnClick?: boolean;
  rtl?: boolean | undefined;
  pauseOnFocusLoss?: boolean | undefined;
  pauseOnHover?: boolean;
  draggable?: true;
  theme?: "light" | "dark" | "colored" | undefined;
  transition?: ToastTransition | undefined;
}

interface ThrowToast {
    type: string;
    value: string
}

const Toast = ({
  position,
  autoClose,
  hideProgressBar,
  newestOnTop,
  closeOnClick,
  rtl,
  pauseOnFocusLoss,
  pauseOnHover,
  draggable,
  theme,
  transition,
}: ToastProps) => {
  return (
    <ToastContainer
      position={position}
      autoClose={autoClose}
      hideProgressBar={hideProgressBar}
      newestOnTop={newestOnTop}
      closeOnClick={closeOnClick}
      rtl={rtl}
      pauseOnFocusLoss={pauseOnFocusLoss}
      draggable={draggable}
      pauseOnHover={pauseOnHover}
      theme={theme}
      transition={transition}
    />
  );
};

export default Toast;


export const throwToast = ({type, value}: ThrowToast) => {
  switch (type) {
    case "info":
      return toast.info(`${value}`);
    case "success":
      return toast.success(`${value}`);
    case "warn":
      return toast.warn(`${value}`);
    case "error":
      return toast.error(`${value}`);
    default:
      return toast(`${value}`);
  }
};
