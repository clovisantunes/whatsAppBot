import React, { useState, useEffect } from "react";
import "./style.css";
import { toast } from "react-toastify";
import { FaSave, FaTrash } from 'react-icons/fa';
import Modal from "../UI/Modal/index.tsx";
import { useImageContext } from "../../Contexts/ImageContext.ts";
import { useDelayContext } from "../../Contexts/DelayContext.ts";
import { useStatusContext } from '../../Contexts/StatusContext.tsx';
import { useResendMessageContext } from "../../Contexts/ResendMessageContext.ts";
import PostMessage from "../Main/utils/PostMessage.ts";
import {
  GetinputInformations,
  GetNumberInformations,
  HandleDeleteMessage,
} from "./utils/GetInputInformations.ts";

interface InputItemsProps {
  savedNumbers: string[];
  onAddNumber: (numbers: string[]) => void; // Agora aceita um array de números
  onCustomMessageChange?: (message: string) => void;
}

export default function InputItems({
  savedNumbers,
  onAddNumber,
  onCustomMessageChange,
}: InputItemsProps) {
  const [numbers, setNumbers] = useState<
    { id: number; number: string; selected: boolean }[]
  >([]);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const [customMessages, setCustomMessages] = useState<
    { id: number; label: string; message: string }[]
  >([]);

  const { images } = useImageContext();
  const { delay } = useDelayContext();
  const { resendMessage } = useResendMessageContext();
  const { addStatus } = useStatusContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [messages, numbers] = await Promise.all([
          GetinputInformations(),
          GetNumberInformations(),
        ]);

        // Inicializa os números com a propriedade `selected: false`
        const numbersWithSelection = numbers.map((number) => ({
          ...number,
          selected: false,
        }));

        setCustomMessages(messages);
        setNumbers(numbersWithSelection);
        setLoading(false);
      } catch (error) {
        setError("Erro ao carregar os dados. Tente novamente mais tarde.");
        setLoading(false);
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const handleNumberClick = (id: number) => {
    setNumbers((prevNumbers) =>
      prevNumbers.map((number) =>
        number.id === id ? { ...number, selected: !number.selected } : number
      )
    );
  };

  const handleSelectAll = () => {
    setNumbers((prevNumbers) =>
      prevNumbers.map((number) => ({ ...number, selected: true }))
    );
  };

  const getSelectedNumbers = () => {
    return numbers
      .filter((number) => number.selected)
      .map((number) => number.number);
  };

  const handleAddNumber = () => {
    const selectedNumbers = getSelectedNumbers(); // Obtém os números selecionados

    if (selectedNumbers.length > 0) {
      onAddNumber(selectedNumbers); // Passa um array de números
      toast.success("Números adicionados com sucesso!");
    } else {
      toast.error("Nenhum número selecionado.");
    }
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const message = event.target.value;
    setSelectedMessage(message);
    setCustomMessage(message);
    if (onCustomMessageChange) {
      onCustomMessageChange(message);
    }
  };

  const handleCustomMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const message = event.target.value;
    setCustomMessage(message);
    if (onCustomMessageChange) {
      onCustomMessageChange(message);
    }
  };

  const handleDeleteMessage = (id: number) => {
    setCustomMessages(customMessages.filter((msg) => msg.id !== id));
    HandleDeleteMessage(id);
    toast.success("Mensagem excluída com sucesso!");
  };

  const handleSendMessage = async () => {
    if (savedNumbers.length === 0) {
      alert("Nenhum número foi adicionado.");
      return;
    }

    if (!customMessage && images.length === 0) {
      alert("Nenhuma mensagem ou imagem foi adicionada.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("message", customMessage);

      images.forEach((image) => {
        formData.append("images", image);
      });

      const sendWithDelay = async (numbers: string[], delay: number) => {
        for (let i = 0; i < numbers.length; i++) {
          const number = numbers[i];

          try {
            const response = await PostMessage({
              to: [number],
              message: customMessage,
              formData,
              ignoreSent: resendMessage ?? undefined,
            });

            if (response.success) {
              addStatus({
                id: Date.now(),
                number,
                status: 'success',
                timestamp: new Date().toISOString(),
              });
              console.log(`Mensagem enviada para ${number}:`, response);
            } else {
              addStatus({
                id: Date.now(),
                number,
                status: 'error',
                timestamp: new Date().toISOString(),
                errorMessage: typeof response.error === 'string' ? response.error : response.error?.message || 'Erro ao enviar mensagem',
              });
              toast.error(typeof response.error === 'string' ? response.error : 'Erro ao enviar mensagem.');
            }
          } catch (error) {
            addStatus({
              id: Date.now(),
              number,
              status: 'error',
              timestamp: new Date().toISOString(),
              errorMessage: error.error || 'Erro ao enviar mensagem',
            });
            toast.error(typeof error.error === 'string' ? error.error : 'Erro ao enviar mensagem.');
          }

          if (i < numbers.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, delay * 60000)); // delay em minutos
          }
        }
      };

      await sendWithDelay(savedNumbers, delay);
      toast.success("Todas as mensagens foram enviadas com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    }
  };

  const handleSaveMessage = (title: string, message: string) => {
    const newMessage = {
      id: customMessages.length + 1,
      label: title,
      message: message,
    };
    setCustomMessages([...customMessages, newMessage]);
    toast.success("Mensagem salva com sucesso!");
  };

  if (loading) {
    return <div className="loading">Carregando dados...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="inputItemsContainer">
      <h2>Adicionar Número com Mensagem</h2>
      <div className="selectGroup">
        <div className="numberList">
          {numbers.map((number) => (
            <div
              key={number.id}
              className={`numberItem ${number.selected ? "selected" : ""}`}
              onClick={() => handleNumberClick(number.id)}
            >
              {number.number}
            </div>
          ))}
        </div>
        <div className="inputsGroup">
        <button className="selectAllButton" onClick={handleSelectAll}>
          Selecionar Todos
        </button>
        <button className="addButton" onClick={handleAddNumber}>
          Adicionar
        </button>
      </div>
      </div>
      <div className="selectGroup">
        <div className="customSelect">
          <select value={selectedMessage} onChange={handleMessageChange}>
            <option value="">Escolha uma mensagem</option>
            {customMessages.map((msg) => (
              <option key={msg.id} value={msg.message}>
                {msg.label}
              </option>
            ))}
          </select>
        </div>
        <button className="saveOption" onClick={() => setOpenModal(true)}>
          <FaSave size={20} />
        </button>
        <button
          className="deleteOption"
          onClick={() => {
            const selectedMsg = customMessages.find((msg) => msg.message === selectedMessage);
            if (selectedMsg) {
              handleDeleteMessage(selectedMsg.id);
            } else {
              toast.error("Nenhuma mensagem selecionada para excluir.");
            }
          }}
        >
          <FaTrash size={20} />
        </button>
      </div>

      <textarea
        className="customMessage"
        value={customMessage}
        onChange={handleCustomMessageChange}
        placeholder="Edite a mensagem selecionada..."
      />

      <button className="sendButton" onClick={handleSendMessage}>
        Enviar
      </button>
      {openModal && (
        <Modal
          onClose={() => setOpenModal(false)}
          message={customMessage}
          onSave={handleSaveMessage}
        />
      )}
    </div>
  );
}