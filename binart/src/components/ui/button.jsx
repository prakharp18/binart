import React from "react";
import clsx from "clsx";

export function Button({ children, onClick, className = "", variant = "default", ...rest }) {
  const base = "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium shadow-sm focus:outline-none";
  const variants = {
    default: "bg-amber-500 text-white hover:bg-amber-600",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      className={clsx(base, variants[variant] || variants.default, className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
