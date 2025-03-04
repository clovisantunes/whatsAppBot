import React, { createContext, useContext, useState } from 'react';

type MessageStatus = {
  id: number;
  number: string;
  status: 'success' | 'error';
  timestamp: string;
  errorMessage?: string;
};

type StatusContextType = {
  statusList: MessageStatus[];
  totalNumbersToSend: number; // Total de números a enviar
  addStatus: (status: MessageStatus) => void;
  clearStatus: () => void;
  setTotalNumbersToSend: (total: number) => void; // Função para atualizar o total de números
};

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const useStatusContext = () => {
  const context = useContext(StatusContext);
  if (!context) {
    throw new Error('useStatusContext must be used within a StatusProvider');
  }
  return context;
};

export const StatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [statusList, setStatusList] = useState<MessageStatus[]>([]);
  const [totalNumbersToSend, setTotalNumbersToSend] = useState<number>(0); // Estado para o total de números

  const addStatus = (status: MessageStatus) => {
    setStatusList((prev) => [...prev, status]);
  };

  const clearStatus = () => {
    setStatusList([]);
  };

  return (
    <StatusContext.Provider
      value={{
        statusList,
        totalNumbersToSend,
        addStatus,
        clearStatus,
        setTotalNumbersToSend,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
};