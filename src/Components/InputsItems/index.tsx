import React, { useState, useEffect, useContext } from "react";
import "./style.css";
import PostMessage from "../Main/utils/PostMessage.ts";
import {
  GetinputInformations,
  GetNumberInformations,
  HandleDeleteMessage,
} from "./utils/GetInputInformations.ts";
import { toast } from "react-toastify";
import { useResendMessageContext } from "../../ResendMessageContext.ts";
import Modal from "../UI/Modal/index.tsx";
import { FaSave, FaTrash } from 'react-icons/fa';
import { useImageContext } from "../../ImageContext.ts"; 
import { useDelayContext } from "../../DelayContext.ts";
import { useStatusContext } from '../../StatusContext.tsx'; 

interface InputItemsProps {
  savedNumbers: string[];
  onAddNumber: (num: string) => void;
  onCustomMessageChange?: (message: string) => void;
}

export default function InputItems({
  savedNumbers,
  onAddNumber,
  onCustomMessageChange,
}: InputItemsProps) {
  const [selectedNumber, setSelectedNumber] = useState("");
  const [selectedMessage, setSelectedMessage] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const [numbers, setNumbers] = useState<
    { id: number; number: string; sent: boolean }[]
  >([]);

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

        setCustomMessages(messages);
        setNumbers(numbers);
        setLoading(false);
      } catch (error) {
        setError("Erro ao carregar os dados. Tente novamente mais tarde.");
        setLoading(false);
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const handleNumberChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNumber(event.target.value);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const message = event.target.value;
    setSelectedMessage(message);
    setCustomMessage(message);
    if (onCustomMessageChange) {
      onCustomMessageChange(message);
    }
  };

  const handleCustomMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const message = event.target.value;
    setCustomMessage(message);
    if (onCustomMessageChange) {
      onCustomMessageChange(message);
    }
  };

  const handleAddNumber = () => {
    if (selectedNumber) {
      const formattedNumber = `55${selectedNumber}`;
      onAddNumber(formattedNumber);
      setSelectedNumber("");
      setSelectedMessage("");
      setCustomMessage("");
    }
  };

  const handleDeleteNumber = (id: number) => {
    setNumbers(numbers.filter((num) => num.id !== id));
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
  
      images.forEach((image, index) => {
        formData.append(`images`, image);
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

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  return (
    <div className="inputItemsContainer">
      <h2>Adicionar Número com Mensagem</h2>
      <div className="selectGroup">
        <div className="customSelect">
          <select value={selectedNumber} onChange={handleNumberChange}>
            <option value="">Escolha um número</option>
            {numbers.map((number) => (
              <option key={number.id} value={number.number}>
                {number.number}
              </option>
            ))}
          </select>
        </div>
        <button className="addButton" onClick={handleAddNumber}>
          Adicionar
        </button>
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
        <button className="saveOption" onClick={handleOpenModal}>
          <FaSave size={20} />
        </button>
        <button
          className="deleteOption"
          onClick={() => {
            const selectedMsg = customMessages.find((msg) => msg.message === selectedMessage);
            if (selectedMsg) {
              handleDeleteMessage(selectedMsg.id); // Passa o id da mensagem selecionada
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