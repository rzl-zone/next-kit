"use client";

import * as React from "react";
import { UseAppRouterInstance } from "../types/types";

export const useTopLoaderRouterWithEnhanced = (router: UseAppRouterInstance) => {
  const { back, forward, push, refresh, replace, ...restRouter } = router;

  const enhancedRouter = React.useMemo(() => {
    return { ...restRouter, push, replace, back, refresh, forward };
  }, [restRouter, push, replace, back, refresh, forward]);

  return enhancedRouter;
};
