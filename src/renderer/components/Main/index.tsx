import React from "react";

export const Main: React.FC<Props> = ({ children }) => (
  <main className="flex w-full h-screen bg-purple-500">
    {children}
  </main>
)

type Props = {}
