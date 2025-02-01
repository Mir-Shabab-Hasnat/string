"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"

const RootProviders = ({ children }: { children: ReactNode }) => {
  const [queryClient] = React.useState(() => new QueryClient({}));
  return (
    <QueryClientProvider client={queryClient}>
      
      
        {children}
      
      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  );
};

export default RootProviders;