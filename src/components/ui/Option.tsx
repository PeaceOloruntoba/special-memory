import React from "react";

interface OptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children: React.ReactNode;
}

export default function Option({ className, children, ...props }: OptionProps) {
  return (
    <option className={className} {...props}>
      {children}
    </option>
  );
}
