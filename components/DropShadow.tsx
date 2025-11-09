import React, { ReactNode } from "react";

const DropShadow = ({
  containerStyle,
  children,
  onClick,
}: {
  containerStyle?: string;
  children: ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`fixed inset-0 z-50 bg-black/60% backdrop-blur-sm flex ${
        containerStyle || ""
      }`}
    >
      {children}
    </div>
  );
};

export default DropShadow;
