import React, { useState } from 'react';
import './style.css';
import { useStatusContext } from '../../Contexts/StatusContext.tsx';
import { 
  HiChartBar, 
  HiCheckCircle, 
  HiXCircle, 
  HiFilter,
  HiClock,
  HiExclamationCircle
} from "react-icons/hi";

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
  const totalPending = totalNumbersToSend - statusList.length;

  const progress = totalNumbersToSend > 0 ? (statusList.length / totalNumbersToSend) * 100 : 0;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `Há ${diffMins} min`;
    if (diffHours < 24) return `Há ${diffHours} h`;
    
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <HiCheckCircle className="status-icon success" />;
      case 'error':
        return <HiXCircle className="status-icon error" />;
      default:
        return <HiClock className="status-icon pending" />;
    }
  };

  return (
    <div className={`status ${className}`}>
      <div className="status__container">
        {/* Header Section */}
        <div className="status__header">
          <div className="status__icon">
            <HiChartBar />
          </div>
          <div className="status__title">
            <h1>Status de Envio</h1>
            <p>Acompanhe o progresso das mensagens</p>
          </div>
        </div>

        {/* Progress Card */}
        <div className="card">
          <div className="card__header">
            <div className="card__title">
              <h2>Progresso Geral</h2>
              <p>Andamento total dos envios</p>
            </div>
            <div className="progress-stats">
              <span className="progress-percentage">{Math.round(progress)}%</span>
            </div>
          </div>

          <div className="card__content">
            <div className="progress-section">
              <div className="progress-bar">
                <div
                  className="progress-bar__fill"
                  style={{ width: `${progress}%` }}
                >
                  <div className="progress-bar__glow"></div>
                </div>
              </div>
              
              <div className="progress-details">
                <div className="progress-item">
                  <span className="progress-label">Concluídos</span>
                  <span className="progress-value success">{statusList.length}</span>
                </div>
                <div className="progress-item">
                  <span className="progress-label">Pendentes</span>
                  <span className="progress-value pending">{totalPending}</span>
                </div>
                <div className="progress-item">
                  <span className="progress-label">Total</span>
                  <span className="progress-value total">{totalNumbersToSend}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="card">
          <div className="card__header">
            <div className="card__title">
              <h2>Estatísticas</h2>
              <p>Resumo do desempenho</p>
            </div>
            <div className="card__icon">
              <HiFilter />
            </div>
          </div>

          <div className="card__content">
            <div className="stats-grid">
              <div className="stat-card success">
                <div className="stat-card__icon">
                  <HiCheckCircle />
                </div>
                <div className="stat-card__content">
                  <span className="stat-card__value">{totalSuccess}</span>
                  <span className="stat-card__label">Sucessos</span>
                </div>
              </div>
              
              <div className="stat-card error">
                <div className="stat-card__icon">
                  <HiXCircle />
                </div>
                <div className="stat-card__content">
                  <span className="stat-card__value">{totalErrors}</span>
                  <span className="stat-card__label">Erros</span>
                </div>
              </div>
              
              <div className="stat-card pending">
                <div className="stat-card__icon">
                  <HiClock />
                </div>
                <div className="stat-card__content">
                  <span className="stat-card__value">{totalPending}</span>
                  <span className="stat-card__label">Pendentes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="card__content">
            <div className="filters">
              <span className="filters__label">Filtrar por:</span>
              <div className="filters__buttons">
                <button
                  className={`filter-btn ${filter === 'all' ? 'filter-btn--active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  <HiFilter className="filter-btn__icon" />
                  Todos
                </button>
                <button
                  className={`filter-btn ${filter === 'success' ? 'filter-btn--active' : ''}`}
                  onClick={() => setFilter('success')}
                >
                  <HiCheckCircle className="filter-btn__icon" />
                  Sucessos
                </button>
                <button
                  className={`filter-btn ${filter === 'error' ? 'filter-btn--active' : ''}`}
                  onClick={() => setFilter('error')}
                >
                  <HiXCircle className="filter-btn__icon" />
                  Erros
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Status List */}
        <div className="card">
          <div className="card__header">
            <div className="card__title">
              <h2>Log de Envios</h2>
              <p>Histórico detalhado das operações</p>
            </div>
            <span className="badge">{filteredStatusList.length}</span>
          </div>

          <div className="card__content">
            {filteredStatusList.length === 0 ? (
              <div className="empty-state">
                <HiExclamationCircle className="empty-state__icon" />
                <h3>Nenhum registro encontrado</h3>
                <p>Os logs de envio aparecerão aqui</p>
              </div>
            ) : (
              <div className="status-list">
                {filteredStatusList.map((item) => (
                  <div key={item.id} className={`status-item status-item--${item.status}`}>
                    <div className="status-item__header">
                      {getStatusIcon(item.status)}
                      <div className="status-item__info">
                        <span className="status-item__number">{item.number}</span>
                        <span className="status-item__time">
                          {formatTimestamp(item.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="status-item__content">
                      {item.status === 'error' && (
                        <div className="status-item__message error">
                          <HiExclamationCircle className="status-item__message-icon" />
                          <span>{item.errorMessage || 'Erro no envio'}</span>
                        </div>
                      )}
                      {item.status === 'success' && (
                        <div className="status-item__message success">
                          <HiCheckCircle className="status-item__message-icon" />
                          <span>Mensagem enviada com sucesso</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}