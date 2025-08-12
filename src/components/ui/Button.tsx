import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button className={className} type={type} {...props}>
      {children}
    </button>
  );
}
