import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Badge({ className, children, ...props }: BadgeProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
