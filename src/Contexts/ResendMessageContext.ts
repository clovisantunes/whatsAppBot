import React, { createContext, useContext, useState } from "react";

type ResendMessageContextType = {
  resendMessage: boolean | null;
  setResendMessage: (resendMessage: boolean | null) => void;
};

const ResendMessageContext = createContext<ResendMessageContextType>({
  resendMessage: null,
  setResendMessage: () => {},
});

export const useResendMessageContext = () => useContext(ResendMessageContext);
export default ResendMessageContext;