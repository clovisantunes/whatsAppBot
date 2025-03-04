import React, { createContext, useContext, useState } from "react";

type DelayContextType = {
  delay: number;
  setDelay: (delay: number) => void;
};

const DelayContext = createContext<DelayContextType>({
  delay: 0,
  setDelay: () => {},
});

export const useDelayContext = () => useContext(DelayContext);
export default DelayContext;