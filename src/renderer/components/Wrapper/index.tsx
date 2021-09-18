import React from "react";

export const Wrapper: React.FC<Props> = ({ children }) => (
  <div className="flex w-full h-screen">
    {children}
  </div>
)

type Props = {}
