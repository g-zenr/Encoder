import React from "react";

interface DividerProps {
  className?: string;
}

const Divider: React.FC<DividerProps> = ({ className = "" }) => (
  <hr className={`border-t border-gray-200 my-4 ${className}`} />
);

export default Divider;
