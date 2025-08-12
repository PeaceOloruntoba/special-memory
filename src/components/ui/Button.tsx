import React from "react";

type ButtonProps = {
  className?: string;
  value: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onclick?: React.MouseEventHandler<HTMLButtonElement>;
  [key: string]: any;
};

export default function Button({
  className,
  value,
  type,
  onclick,
  ...props
}: ButtonProps) {
  return (
    <button className={className} type={type} onClick={onclick} {...props}>
      {value}
    </button>
  );
}
