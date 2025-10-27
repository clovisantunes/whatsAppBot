import React, { useState, useEffect } from "react";
import "./style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputItems from "../InputsItems/index.tsx";
import { useStatusContext } from '../../Contexts/StatusContext.tsx';
import { HiPhone, HiSave, HiTrash, HiClipboardList } from "react-icons/hi";

type MainProps = {
  className: string;
};

export default function Main({ className }: MainProps) {
  const [number, setNumber] = useState("");
  const [savedNumbers, setSavedNumbers] = useState<string[]>([]);
  const { setTotalNumbersToSend } = useStatusContext();

  const isValidPhoneNumber = (num: string) => {
    return /^55\d{10}$/.test(num);
  };

  const formatPhoneNumber = (num: string) => {
    const numericValue = num.replace(/\D/g, "");
    
    if (numericValue.startsWith("55") && numericValue.length === 13) {
      return numericValue.slice(0, 10) + numericValue.slice(11);
    }

    if (!numericValue.startsWith("55")) {
      return `55${numericValue}`;
    }

    return numericValue;
  };

  const handleSave = () => {
    if (!number.trim()) {
      toast.warning("Digite pelo menos um número");
      return;
    }

    const numbersArray = number.split(/[\n, ]+/).map(num => num.trim()).filter(num => num !== "");

    const validNumbers: string[] = [];
    const invalidNumbers: string[] = [];

    numbersArray.forEach(num => {
      const formattedNumber = formatPhoneNumber(num);

      if (!isValidPhoneNumber(formattedNumber)) {
        invalidNumbers.push(num);
      } else if (!savedNumbers.includes(formattedNumber)) {
        validNumbers.push(formattedNumber);
      } else {
        toast.warning(`Número já existe: ${formattedNumber}`);
      }
    });

    if (invalidNumbers.length > 0) {
      toast.error(`${invalidNumbers.length} número(s) inválido(s). Formato: DDD + 9 dígitos`);
    }

    if (validNumbers.length > 0) {
      setSavedNumbers(prev => [...prev, ...validNumbers]);
      toast.success(`${validNumbers.length} número(s) adicionado(s) com sucesso`);
    }

    setNumber("");
  };

  const handleDelete = (num: string) => {
    const item = document.getElementById(`saved-${num}`);
    if (item) {
      item.classList.add("removing");
      setTimeout(() => {
        setSavedNumbers((prev) => prev.filter((n) => n !== num));
        toast.info("Número removido");
      }, 300);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNumber(e.target.value);
  };

  const handleAddFromInputItems = (numbers: string[]) => {
    const formattedNumbers = numbers.map(num => formatPhoneNumber(num));
    const uniqueNumbers = formattedNumbers.filter(num => !savedNumbers.includes(num));

    if (uniqueNumbers.length > 0) {
      setSavedNumbers(prev => [...prev, ...uniqueNumbers]);
      toast.success(`${uniqueNumbers.length} número(s) importado(s)`);
    } else {
      toast.info("Todos os números já foram adicionados");
    }
  };

  const handleClearAll = () => {
    if (savedNumbers.length > 0) {
      setSavedNumbers([]);
      toast.info("Todos os números foram removidos");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };

  useEffect(() => {
    setTotalNumbersToSend(savedNumbers.length);
  }, [savedNumbers, setTotalNumbersToSend]);

  return (
    <div className={`main ${className}`}>
      <ToastContainer 
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      <div className="main__container">
        {/* Card de Adição de Números */}
        <div className="card">
          <div className="card__header">
            <div className="card__icon">
              <HiPhone />
            </div>
            <div className="card__title">
              <h2>Adicionar Números</h2>
              <p>Digite os números para envio das mensagens</p>
            </div>
          </div>

          <div className="card__content">
            <div className="input-group">
              <label htmlFor="numberInput" className="input-label">
                Números de telefone
              </label>
              <textarea
                id="numberInput"
                className="input textarea"
                placeholder="Exemplo: 51999999999, 51988888888&#10;Ou cole uma lista com quebras de linha&#10;Separe por vírgulas, espaços ou enters"
                value={number}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                rows={5}
              />
              <div className="input-hint">
                Pressione Ctrl+Enter para salvar rapidamente
              </div>
            </div>

            <button 
              className="btn btn-primary btn-full"
              onClick={handleSave}
              disabled={!number.trim()}
            >
              <HiSave className="btn__icon" />
              Salvar Números
            </button>
          </div>
        </div>

        {/* Card de Números Salvos */}
        <div className="card">
          <div className="card__header">
            <div className="card__icon">
              <HiClipboardList />
            </div>
            <div className="card__title">
              <h2>Números Salvos</h2>
              <p>Gerencie os números adicionados para envio</p>
            </div>
            <div className="card__actions">
              {savedNumbers.length > 0 && (
                <>
                  <span className="badge">{savedNumbers.length}</span>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={handleClearAll}
                    title="Limpar todos os números"
                  >
                    <HiTrash className="btn__icon" />
                    Limpar
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="card__content">
            {savedNumbers.length === 0 ? (
              <div className="empty-state">
                <HiPhone className="empty-state__icon" />
                <h3>Nenhum número adicionado</h3>
                <p>Os números salvos aparecerão aqui</p>
              </div>
            ) : (
              <div className="numbers-container">
                <div className="numbers-grid">
                  {savedNumbers.map((num) => (
                    <div 
                      key={num} 
                      id={`saved-${num}`}
                      className="number-chip"
                    >
                      <span className="number-chip__text">{num}</span>
                      <button 
                        className="number-chip__delete"
                        onClick={() => handleDelete(num)}
                        title="Remover número"
                        aria-label={`Remover número ${num}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="numbers-summary">
                  <span className="numbers-count">
                    {savedNumbers.length} número(s) preparado(s) para envio
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Componente de Input Items */}
        <InputItems savedNumbers={savedNumbers} onAddNumber={handleAddFromInputItems} />
      </div>
    </div>
  );
}