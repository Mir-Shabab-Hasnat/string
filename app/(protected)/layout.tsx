import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto p-5">
        {children}
      </div>
      
    </div>
  );
};

export default layout;
