import React, { useState } from 'react';
import './style.css';
import { useStatusContext } from '../../Contexts/StatusContext.tsx';

type StatusComponentProps = {
  className: string;
};

export default function StatusComponent({ className }: StatusComponentProps) {
  const { statusList, totalNumbersToSend } = useStatusContext();
  const [filter, setFilter] = useState<'all' | 'success' | 'error'>('all');

  const filteredStatusList = statusList.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const totalSuccess = statusList.filter((item) => item.status === 'success').length;
  const totalErrors = statusList.filter((item) => item.status === 'error').length;

  const progress = totalNumbersToSend > 0 ? (statusList.length / totalNumbersToSend) * 100 : 0;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className={`statusComponent_Container ${className}`}>
      <div className="statusComponent_Components">
        <h1>Andamento dos envios</h1>

        <div className="progressBar">
          <div
            className="progressFill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

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

        {/* Filtros */}
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

        {/* Lista de status */}
        <div className="statusList">
          {filteredStatusList.map((item) => (
            <div key={item.id} className={`statusItem ${item.status}`}>
              <div className="statusHeader">
                <span className="number">{item.number}</span>
                <span className="timestamp">
                  {formatTimestamp(item.timestamp)} 
                </span>
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