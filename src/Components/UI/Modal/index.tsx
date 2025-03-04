import React, { useState } from "react";
import './style.css';
import { HandleSaveMessage } from "../../InputsItems/utils/GetInputInformations.ts";
import { toast } from "react-toastify"; // Importe o toast para exibir feedback

interface ModalProps {
    onClose: () => void;
    message: string;
    onSave: (title: string, message: string) => void; 
}

export default function Modal({ onClose, message, onSave }: ModalProps) {
  const [title, setTitle] = useState("");

  const handleSave = async () => {
    if (title.trim() === "") {
        toast.error("Por favor insira um titulo para a mensagem!"); // Feedback de erro
      return;
    }

    try {
      // Chama a função HandleSaveMessage para salvar a mensagem no banco de dados
      const success = await HandleSaveMessage(title, message);

      if (success) {
        toast.success("Mensagem salva com sucesso!"); // Feedback de sucesso
        onSave(title, message); // Chama a função onSave para atualizar o estado no componente pai
        onClose(); // Fecha o modal
      }
    } catch (error) {
      console.error("Erro ao salvar a mensagem:", error);
      toast.error("Erro ao salvar a mensagem. Tente novamente."); // Feedback de erro
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Salvar Mensagem</h2>
        <input
          type="text"
          placeholder="Digite um título para a mensagem"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p>{message}</p>
        <button onClick={handleSave}>Salvar</button>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}