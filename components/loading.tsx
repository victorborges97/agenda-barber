import React from "react";

type PropsLoading = {
  className?: string;
  color?: string;
};
const Loading: React.FC<PropsLoading> = ({
  className = "w-8 h-8",
  color = "blue-600",
}) => {
  return (
    <div
      className={`
        ${className}
        border-t-${color} border-4 border-solid 
        rounded-full animate-spin`}
    ></div>
  );
};

export default Loading;
