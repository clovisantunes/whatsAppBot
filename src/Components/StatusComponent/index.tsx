import React, { useState } from 'react';
import './style.css';
import { useStatusContext } from '../../StatusContext.tsx';

type StatusComponentProps = {
  className: string;
  totalNumbersToSend: number; // Recebe o total de números a enviar via props
};

type MessageStatus = {
  id: number;
  number: string;
  status: 'success' | 'error';
  timestamp: string;
  errorMessage?: string;
};

export default function StatusComponent({ className, totalNumbersToSend }: StatusComponentProps) {
  const { statusList } = useStatusContext();
  const [filter, setFilter] = useState<'all' | 'success' | 'error'>('all');

  const filteredStatusList = statusList.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const totalSuccess = statusList.filter((item) => item.status === 'success').length;
  const totalErrors = statusList.filter((item) => item.status === 'error').length;

  // Calcular números restantes
  const remainingToSend = totalNumbersToSend - statusList.length;

  return (
    <div className={`statusComponent_Container ${className}`}>
      <div className="statusComponent_Components">
        <h1>Andamento dos envios</h1>

        <div className="statusStats">
          <div className="statItem success">
            <span>Sucessos:</span>
            <span>{totalSuccess}</span>
          </div>
          <div className="statItem error">
            <span>Erros:</span>
            <span>{totalErrors}</span>
          </div>
        </div>

        {/* Exibir a quantidade de mensagens restantes */}
        <div className="statusRemaining">
          <span>Mensagens restantes: </span>
          <span>{remainingToSend}</span>
        </div>

        <div className="statusFilters">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            Todos
          </button>
          <button
            className={filter === 'success' ? 'active' : ''}
            onClick={() => setFilter('success')}
          >
            Sucessos
          </button>
          <button
            className={filter === 'error' ? 'active' : ''}
            onClick={() => setFilter('error')}
          >
            Erros
          </button>
        </div>

        <div className="statusList">
          {filteredStatusList.map((item) => (
            <div key={item.id} className={`statusItem ${item.status}`}>
              <div className="statusHeader">
                <span className="number">{item.number}</span>
                <span className="timestamp">{item.timestamp}</span>
              </div>
              {item.status === 'error' && (
                <div className="errorMessage">
                  <span>Erro: </span>
                  <span>{item.errorMessage}</span>
                </div>
              )}
              {item.status === 'success' && (
                <div className="successMessage">
                  <span>Mensagem enviada com sucesso.</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}