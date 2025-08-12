import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export default function Select({ className, children, ...props }: SelectProps) {
  return (
    <select className={className} {...props}>
      {children}
    </select>
  );
}
